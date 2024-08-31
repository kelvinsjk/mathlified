import { Vector } from './vector.js';
/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {Vector|[Shorthand, Shorthand, Shorthand]} VectorShorthand */

/**
 * @param {VectorShorthand} shorthand
 * @returns {Vector}
 */
export function vectorShorthandToVector(shorthand) {
	return Array.isArray(shorthand) ? new Vector(...shorthand) : shorthand;
}
