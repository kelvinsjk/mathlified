/**
 * @param {Shorthand} exp
 * @returns {Expression}
 */
export function absTerm(exp: Shorthand): Expression;
/**
 * Absolute function Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Abs extends Fn {
    /**
     * Creates an absolute term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /**
     * @returns {Abs}
     */
    clone(): Abs;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Abs}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Abs;
}
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Expression } from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';
//# sourceMappingURL=absolute.d.ts.map