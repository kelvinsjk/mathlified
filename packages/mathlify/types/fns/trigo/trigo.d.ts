/**
 * Creates a expression of the form a*sqrt{b}
 * @param {'sin'|'cos'} trigFn
 * @param {Shorthand} arg
 * @param {{coeff?: number|Numeral|Expression}} [options]
 * @returns {Expression}
 */
export function trigTerm(trigFn: "sin" | "cos", arg: Shorthand, options?: {
    coeff?: number | Numeral | Expression;
} | undefined): Expression;
/**
 * Sine Class
 * */
export class Sin extends Fn {
    /**
     * @param {Shorthand} ratio
     * @returns {Expression}
     */
    static inverse(ratio: Shorthand): Expression;
    /**
     * Creates a Sqrt term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /** @type {'sin'} */
    functionName: "sin";
    /**
     * @returns {Sin}
     */
    clone(): Sin;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Sin}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Sin;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Sin|Numeral|Product|Quotient}
     */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Sin | Numeral | Product | Quotient;
}
/**
 * Cosine Class
 * */
export class Cos extends Fn {
    /**
     * @param {Shorthand} ratio
     * @returns {Expression}
     */
    static inverse(ratio: Shorthand): Expression;
    /**
     * Creates a Sqrt term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /** @type {'cos'} */
    functionName: "cos";
    /**
     * @returns {Cos}
     */
    clone(): Cos;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Cos}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Cos;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Cos|Numeral|Quotient|Product} //{Sin|Quotient|Numeral}
     */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Cos | Numeral | Quotient | Product;
}
/**
 * Tangent Class
 * */
export class Tan extends Fn {
    /**
     * @param {Shorthand} ratio
     * @returns {Expression}
     */
    static inverse(ratio: Shorthand): Expression;
    /**
     * Creates a Sqrt term
     * @param {Shorthand} expression
     */
    constructor(expression: Shorthand);
    /** @type {'tan'} */
    functionName: "tan";
    /**
     * @returns {Tan}
     */
    clone(): Tan;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Tan}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Tan;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Tan|Numeral|Quotient|Product|Sqrt} //{Sin|Quotient|Numeral}
     */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Tan | Numeral | Quotient | Product | Sqrt;
}
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Numeral } from '../../core/expression/expression.js';
import { Expression } from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';
import { Product } from '../../core/expression/expression.js';
import { Quotient } from '../../core/expression/expression.js';
import { Sqrt } from '../sqrt/sqrt.js';
//# sourceMappingURL=trigo.d.ts.map