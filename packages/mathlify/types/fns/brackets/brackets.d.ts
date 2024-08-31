/**
 * Brackets Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Brackets extends Fn {
    /**
     * Creates a Bracketed term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /**
     * @returns {Brackets}
     */
    clone(): Brackets;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Brackets}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Brackets;
}
export type Expression = import("../../index.js").Expression;
export type Variable = import("../../index.js").Variable;
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
import { Fn } from '../../core/expression/fn/custom-function.js';
//# sourceMappingURL=brackets.d.ts.map