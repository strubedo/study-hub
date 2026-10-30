// CCNA labs provider for the engine (course.js `labs.module`): the lab catalogue,
// plus a lazy loader for the IOS simulator so it only downloads when a lab opens.
export { default as labs } from './sim/labs/index.js';

/** Resolves to mountLab(container, lab, opts) from the simulator UI. */
export async function loadMountLab() {
  const ui = await import('./sim/ui.js');
  return ui.mountLab;
}
