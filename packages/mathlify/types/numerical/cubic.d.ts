/**
 * finds a rational root of a cubic if it exists,
 * or use the bisection method to find a numerical root
 * @param {Polynomial|[number,number,number,number]|Expression} cubic
 * @param {number} [lower=-10] lower bound to search for numerical root
 * @param {number} [upper=10] upper bound to search for numerical root
 * @param {number} [precision=5] number of digits after the decimal point to match before terminating
 * @returns {number|Expression}
 */
export function cubicRoot(cubic: Polynomial | [number, number, number, number] | Expression, lower?: number | undefined, upper?: number | undefined, precision?: number | undefined): number | Expression;
import { Polynomial } from '../index.js';
import { Expression } from '../index.js';
//# sourceMappingURL=cubic.d.ts.map