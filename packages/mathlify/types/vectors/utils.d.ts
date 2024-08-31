/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {Vector|[Shorthand, Shorthand, Shorthand]} VectorShorthand */
/**
 * @param {VectorShorthand} shorthand
 * @returns {Vector}
 */
export function vectorShorthandToVector(shorthand: VectorShorthand): Vector;
export type Shorthand = import("../core/expression/expression.js").Shorthand;
export type VectorShorthand = Vector | [Shorthand, Shorthand, Shorthand];
import { Vector } from './vector.js';
//# sourceMappingURL=utils.d.ts.map