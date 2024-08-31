/**
 * combines fractions within a Sum, with full simplification
 * @param {Expression} exp
 * @param {{target?: number[], targets?:number[][]}} [options] - targets take precedence over target
 * @returns {Expression}
 */
export function combineFraction(exp: Expression, options?: {
    target?: number[];
    targets?: number[][];
} | undefined): Expression;
import { Expression } from '../core/expression/expression.js';
//# sourceMappingURL=combine-fraction.d.ts.map