// Domain 1 — Software Engineering (LPI 701.1-701.5). Original questions for LPI DevOps Tools Engineer 701-200 v2.0.
import partA from './questions-a.js';
import partB from './questions-b.js';

export default [...partA, ...partB].map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
