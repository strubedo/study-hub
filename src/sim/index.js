// Public entry point of the IOS simulator engine (pure JS, no DOM).

import { buildLab, serialize, loadConfig } from './loader.js';
import { isHost } from './device.js';

export { buildLab, serialize, loadConfig };
export { Network } from './network.js';

const ERR = /% (Invalid input|Incomplete command|Ambiguous command)|Unknown command or computer name|is not recognized as an internal|syntax supplied for this command is not valid/;

/**
 * Replay a solution ({ DEV: "cmd\ncmd" }) through each device's CLI session.
 * IOS sessions are put into privileged EXEC first. Returns { errors, transcript }.
 */
export function replaySolution(net, solution) {
  const errors = [];
  const transcript = [];
  for (const [name, text] of Object.entries(solution)) {
    const s = net.openSession(name);
    if (!isHost(net.device(name)) && s.mode === 'user') s.mode = 'exec';
    for (const line of text.split('\n')) {
      if (!s.pending && !line.trim()) continue;
      const prompt = s.prompt;
      const out = s.input(line);
      transcript.push(`${name}: ${prompt}${line}${out ? `\n${out}` : ''}`);
      if (ERR.test(out)) errors.push({ device: name, line, output: out });
    }
  }
  return { errors, transcript };
}
