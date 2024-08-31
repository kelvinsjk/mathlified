/** @typedef {import('../core/expression/expression.js').Numeral} Numeral */
/** @typedef {import('../core/expression/expression.js').Variable} Variable */
/**
 * @param {Expression} exp
 * @param {string|Variable} [variable='x']
 * @returns {Expression}
 */
export function differentiate(exp: Expression, variable?: string | import("../core/expression/expression.js").Variable | undefined): Expression;
export type Numeral = import("../core/expression/expression.js").Numeral;
export type Variable = import("../core/expression/expression.js").Variable;
import { Expression } from '../core/expression/expression.js';
//# sourceMappingURL=differentiate.d.ts.map