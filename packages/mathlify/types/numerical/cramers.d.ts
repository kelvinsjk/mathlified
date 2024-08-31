/**
 * @overload
 * @param {[number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number]} coeffs2
 * @param {number} val2
 * @returns {[number,number]}
 */
export function cramers(coeffs1: [number, number], val1: number, coeffs2: [number, number], val2: number): [number, number];
/**
 * @overload
 * @param {[number,number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number,number]} coeffs2
 * @param {number} val2
 * @param {[number,number,number]} coeffs3
 * @param {number} val3
 * @returns {[number,number,number]}
 */
export function cramers(coeffs1: [number, number, number], val1: number, coeffs2: [number, number, number], val2: number, coeffs3: [number, number, number], val3: number): [number, number, number];
/**
 * @overload
 * @param {[number,number,number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number,number,number]} coeffs2
 * @param {number} val2
 * @param {[number,number,number,number]} coeffs3
 * @param {number} val3
 * @param {[number,number,number,number]} coeffs4
 * @param {number} val4
 * @returns {[number,number,number,number]}
 */
export function cramers(coeffs1: [number, number, number, number], val1: number, coeffs2: [number, number, number, number], val2: number, coeffs3: [number, number, number, number], val3: number, coeffs4: [number, number, number, number], val4: number): [number, number, number, number];
/**
 * @overload
 * @param {[number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @returns {[Expression,Expression]}
 */
export function cramersFrac(coeffs1: [number | Expression, number | Expression], val1: number | Expression, coeffs2: [number | Expression, number | Expression], val2: number | Expression): [Expression, Expression];
/**
 * @overload
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs3
 * @param {number|Expression} val3
 * @returns {[Expression,Expression,Expression]}
 */
export function cramersFrac(coeffs1: [number | Expression, number | Expression, number | Expression], val1: number | Expression, coeffs2: [number | Expression, number | Expression, number | Expression], val2: number | Expression, coeffs3: [number | Expression, number | Expression, number | Expression], val3: number | Expression): [Expression, Expression, Expression];
/**
 * @overload
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs3
 * @param {number|Expression} val3
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs4
 * @param {number|Expression} val4
 * @returns {[Expression,Expression,Expression,Expression]}
 */
export function cramersFrac(coeffs1: [number | Expression, number | Expression, number | Expression, number | Expression], val1: number | Expression, coeffs2: [number | Expression, number | Expression, number | Expression, number | Expression], val2: number | Expression, coeffs3: [number | Expression, number | Expression, number | Expression, number | Expression], val3: number | Expression, coeffs4: [number | Expression, number | Expression, number | Expression, number | Expression], val4: number | Expression): [Expression, Expression, Expression, Expression];
import { Expression } from '../core/expression/expression';
//# sourceMappingURL=cramers.d.ts.map