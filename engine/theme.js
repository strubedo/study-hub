// Light/dark theme shared by the hub and every course. The choice lives in
// localStorage under THEME_KEY ("light" | "dark"); assets/theme-init.js reads
// the same key before first paint, so keep the two in sync.

export const THEME_KEY = 'studyhub:theme';

export const currentTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** The saved hub-wide theme, or null when none was saved (or storage is blocked). */
export function savedTheme() {
  try {
    const v = globalThis.localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/** Applies a theme to the page and remembers it hub-wide. Returns the applied theme. */
export function setTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  if (next === 'light') document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  try {
    globalThis.localStorage.setItem(THEME_KEY, next);
  } catch { /* storage blocked: the theme still applies for this page view */ }
  return next;
}
