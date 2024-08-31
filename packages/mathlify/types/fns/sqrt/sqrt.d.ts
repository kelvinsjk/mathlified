/**
 * Creates a expression of the form a*sqrt{b}
 * @param {Shorthand} radicand
 * @param {{coeff?: number|Numeral|Expression} & SimplifyOptions} [options]
 * @returns {Expression}
 */
export function sqrtTerm(radicand: Shorthand, options?: ({
    coeff?: number | Numeral | Expression;
} & import("../../core/expression/expression.js").SimplifyOptions) | undefined): Expression;
/**
 * Simplifies
 * - sqrt{a} sqrt{b} into sqrt{a*b}
 * - sqrt{a}^2 into a
 * @param {Expression} expression
 * @returns {Expression}
 */
export function simplifySurd(expression: Expression): Expression;
/**
 * Given an expression a + k sqrt{b}, returns a - k sqrt{b}
 * @param {Expression} expression
 */
export function surdConjugate(expression: Expression): Sum;
/**
 * Sqrt Class
 * */
export class Sqrt extends Fn {
    /**
     * Creates a Sqrt term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /**
     * @returns {Sqrt}
     */
    clone(): Sqrt;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Sqrt}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Sqrt;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Sqrt|Product|Numeral}
     */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Sqrt | Product | Numeral;
}
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Numeral } from '../../core/expression/expression.js';
import { Expression } from '../../core/expression/expression.js';
import { Sum } from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';
import { Product } from '../../core/expression/expression.js';
//# sourceMappingURL=sqrt.d.ts.map