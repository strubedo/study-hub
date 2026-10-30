// Sidebar navigation for a course: the engine's own routes, minus pages the
// course has no content for, plus the course's plugin routes. Pure.

const CORE = [
  { group: 'Study' },
  { path: '', label: 'Dashboard', icon: 'home', view: 'dashboard' },
  { path: 'plan', label: 'Study Plan', icon: 'plan', view: 'plan' },
  { path: 'learn', label: 'Curriculum', icon: 'book', view: 'curriculum' },
  { path: 'videos', label: 'Video Course', icon: 'video', view: 'videos', needs: 'videos' },
  { path: 'guide', label: 'Exam Guide', icon: 'target', view: 'guide', needs: 'guide' },
  { group: 'Practice' },
  { path: 'practice', label: 'Question Bank', icon: 'quiz', view: 'practice' },
  { path: 'exam', label: 'Exam Simulator', icon: 'exam', view: 'exam' },
  { path: 'flashcards', label: 'Flashcards', icon: 'cards', view: 'flashcards', badge: 'due' },
  { group: 'Tools' },
  { path: 'reference', label: 'Reference', icon: 'ref', view: 'reference', needs: 'reference' },
  { path: 'settings', label: 'Settings', icon: 'settings', view: 'settings' },
];

/** Routes reachable without a nav entry, mapped to the view that renders them. */
export const EXTRA_ROUTES = { topic: 'curriculum', lesson: 'lesson' };

/** Index just past the last entry of `group` (where a new entry for it goes), or -1. */
function groupEnd(items, group) {
  const start = items.findIndex((n) => n.group === group);
  if (start === -1) return -1;
  const next = items.findIndex((n, i) => i > start && n.group);
  return next === -1 ? items.length : next;
}

/**
 * Plugin entries ({ path, label, icon, group, module, after? }) go right after the
 * entry whose path is `after`, else at the end of their group (a new group is
 * appended when it does not exist yet).
 */
function insertPlugin(items, plugin) {
  const entry = { path: plugin.path, label: plugin.label, icon: plugin.icon, module: plugin.module };
  const afterIdx = plugin.after !== undefined ? items.findIndex((n) => !n.group && n.path === plugin.after) : -1;
  if (afterIdx !== -1) return [...items.slice(0, afterIdx + 1), entry, ...items.slice(afterIdx + 1)];
  const end = groupEnd(items, plugin.group);
  if (end === -1) return [...items, { group: plugin.group }, entry];
  return [...items.slice(0, end), entry, ...items.slice(end)];
}

/** course: normalized course config. Returns [{ group } | { path, label, icon, view | module, badge? }]. */
export function buildNav(course) {
  const core = CORE.filter((n) => !n.needs || course[n.needs]).map(({ needs: _needs, ...n }) => n);
  return course.nav.reduce(insertPlugin, core);
}
