/**
 * Creates a expression of the form a*sqrt{b}
 * @param {Shorthand} arg
 * @param {{coeff?: number|Numeral} & SimplifyOptions} [options]
 * @returns
 */
export function logTerm(arg: Shorthand, options?: ({
    coeff?: number | Numeral;
} & import("../../core/expression/expression.js").SimplifyOptions) | undefined): Expression;
/**
 * Logarithm Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Logarithm extends Fn {
    /**
     * Creates a Sqrt term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /**
     * @returns {Logarithm}
     */
    clone(): Logarithm;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Logarithm}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Logarithm;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Logarithm|Numeral}
     */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Logarithm | Numeral;
}
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Numeral } from '../../core/expression/expression.js';
import { Expression } from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';
//# sourceMappingURL=logarithm.d.ts.map