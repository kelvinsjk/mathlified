/** @typedef {import('../../core/expression/expression.js').Numeral} Numeral */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
/**
 * @param {Expression} expression
 * @param {string|Variable} variable
 * @returns {Numeral|Expression}
 */
export function getLinearPolyLeadingCoeff(expression: Expression, variable: string | Variable): Numeral | Expression;
export type Numeral = import("../../core/expression/expression.js").Numeral;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Expression } from '../../core/expression/expression.js';
//# sourceMappingURL=utils.d.ts.map