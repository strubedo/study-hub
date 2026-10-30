// Applies the saved theme before first paint to avoid a flash. Classic
// (non-module) script so it runs synchronously in <head>.
// Order: the hub-wide "studyhub:theme" key (engine/theme.js), then the theme in
// the course settings named by data-settings-key (e.g. "ccna:settings", where
// the CCNA site kept it before the hub existed). Default: dark.
(() => {
  try {
    const shared = localStorage.getItem('studyhub:theme');
    const key = document.currentScript?.dataset.settingsKey;
    const theme = shared || (key ? JSON.parse(localStorage.getItem(key) || '{}')?.theme : null);
    if (theme === 'light') document.documentElement.dataset.theme = 'light';
  } catch { /* storage blocked or corrupt: default dark theme */ }
})();
