// SSH / Telnet into an IOS device from a router or PC. Reachability and
// vty access are tested with a real TCP SYN through the data plane (ACLs,
// NAT, routing, `transport input`, `access-class`), then the vty login rules
// (`login`, `login local`, line password, local users) are enforced.

import { ipStr, hashStr } from '../util.js';
import { isIos } from '../device.js';

function fingerprint(dev) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  return Array.from({ length: 43 }, (_, i) => chars[hashStr(`${dev.name}:${i}`) % 64]).join('');
}

function closedMsg(s, ip) {
  return s.isPc ? `Connection to ${ipStr(ip)} closed.` : `\n[Connection to ${ipStr(ip)} closed by foreign host]`;
}

function checkUser(net, target, user, pw) {
  const u = target.cfg.users.get(user);
  if (!u) return null;
  if (u.secret && net.checkSecret(u.secret, pw)) return u;
  if (u.password && u.password.plain === pw) return u;
  return null;
}

function attach(s, target, ip, level) {
  const rs = s.net.newIosSession(target);
  rs.mode = level >= 15 ? 'exec' : 'user';
  rs.vty = true;
  rs.remoteExit = () => { s.remote = null; return closedMsg(s, ip); };
  s.remote = rs;
  return '';
}

function banner(target) { return target.cfg.banner ? `${target.cfg.banner}\n` : ''; }

/** Open an SSH/Telnet session. Returns text to print (may set pending prompts). */
export function connectRemote(s, proto, ip, user) {
  const net = s.net;
  const port = proto === 'ssh' ? 22 : 23;
  const res = net.tcpConnect(s.dev, ip, port);
  const target = net.deviceByIp(ip);
  const pre = proto === 'telnet' && !s.isPc ? `Trying ${ipStr(ip)} ... ` : '';
  if (res !== 'open' || !target || !isIos(target)) {
    if (s.isPc) return proto === 'ssh' ? `ssh: connect to host ${ipStr(ip)} port 22: ${res === 'refused' ? 'Connection refused' : 'Connection timed out'}` : `Connecting To ${ipStr(ip)}...Could not open connection to the host, on port 23: Connect failed`;
    return `${pre}\n% Connection ${res === 'refused' ? 'refused by remote host' : 'timed out; remote host not responding'}`;
  }
  const vty = target.cfg.lines.vty;
  if (proto === 'ssh') return sshLogin(s, target, ip, user, vty);
  const head = `${pre}${pre ? 'Open\n' : ''}${banner(target)}`;
  if (!vty.login && !vty.loginLocal) return head + attach(s, target, ip, 1);
  if (vty.login && !vty.loginLocal && !vty.password) return `${head}\nPassword required, but none set\n${closedMsg(s, ip)}`;
  let tries = 0;
  const fail = () => {
    tries += 1;
    if (tries >= 3) return `% ${vty.loginLocal ? 'Login invalid' : 'Bad passwords'}\n${closedMsg(s, ip)}`;
    return null;
  };
  if (vty.loginLocal) {
    const askUser = () => s.ask('Username: ', (u) => {
      s.ask('Password: ', (pw) => {
        const ok = checkUser(net, target, u.trim(), pw);
        if (ok) return attach(s, target, ip, ok.privilege);
        const f = fail(); if (f) return f;
        askUser();
        return '% Login invalid\n';
      }, true);
      return '';
    });
    askUser();
    return `${head}\nUser Access Verification\n`;
  }
  const askPw = () => s.ask('Password: ', (pw) => {
    if (pw === vty.password.plain) return attach(s, target, ip, 1);
    const f = fail(); if (f) return f;
    askPw();
    return '';
  }, true);
  askPw();
  return `${head}\nUser Access Verification\n`;
}

function sshLogin(s, target, ip, user, vty) {
  const net = s.net;
  let tries = 0;
  const promptText = s.isPc ? `${user}@${ipStr(ip)}'s password: ` : 'Password: ';
  const tryPw = (pw) => {
    const ok = vty.loginLocal ? checkUser(net, target, user, pw) : null;
    if (ok) return banner(target) + attach(s, target, ip, ok.privilege);
    tries += 1;
    if (tries >= 3) return s.isPc ? `${user}@${ipStr(ip)}: Permission denied (publickey,keyboard-interactive,password).` : '% Authentication failed.';
    s.ask(promptText, tryPw, true);
    return s.isPc ? 'Permission denied, please try again.' : '';
  };
  if (s.isPc && !(s.knownHosts || new Set()).has(ip)) {
    s.ask(`Are you sure you want to continue connecting (yes/no/[fingerprint])? `, (ans) => {
      if (!/^yes$/i.test(ans.trim())) return 'Host key verification failed.';
      s.knownHosts = new Set([...(s.knownHosts || []), ip]);
      s.ask(promptText, tryPw, true);
      return `Warning: Permanently added '${ipStr(ip)}' (RSA) to the list of known hosts.`;
    });
    return `The authenticity of host '${ipStr(ip)} (${ipStr(ip)})' can't be established.\nRSA key fingerprint is SHA256:${fingerprint(target)}.\nThis key is not known by any other names.`;
  }
  s.ask(promptText, tryPw, true);
  return '';
}
