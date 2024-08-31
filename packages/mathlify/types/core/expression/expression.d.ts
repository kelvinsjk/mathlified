/**
 *
 * @param {Shorthand} shorthand
 * @returns {Expression}
 */
export function shorthandToExpression(shorthand: Shorthand): Expression;
/**
 *
 * @param {Expression[]} exps
 * @returns {Expression}
 */
export function expression_gcd(...exps: Expression[]): Expression;
/**
 * Creates an simplified Expression instance representing a sum
 * @param {Shorthand[]} terms
 * @returns {Expression}
 */
export function sum(...terms: Shorthand[]): Expression;
/**
 * Creates an Expression instance representing a sum
 * @param {Shorthand[]} terms
 * @returns {Expression}
 */
export function sumVerbatim(...terms: Shorthand[]): Expression;
/**
 * Creates an Expression instance representing a quotient
 * @param {Shorthand} numerator
 * @param {Shorthand} denominator
 * @param {SimplifyOptions} [options]
 * @returns {Expression}
 */
export function quotient(numerator: Shorthand, denominator: Shorthand, options?: SimplifyOptions | undefined): Expression;
/**
 * Creates an Expression instance representing a quotient
 * @param {Shorthand} power
 * @returns {Expression}
 */
export function expTerm(power: Shorthand): Expression;
/**
 *
 * @param {string} functionName
 * @param {Shorthand} argument
 * @returns {Expression}
 */
export function fnTerm(functionName: string, argument: Shorthand): Expression;
/**
 * The `Expression` class contains the tree representation of
 * a mathematical expression built from the following nodes:
 * - `Numeral` for numbers (only "Fraction"s supported at the moment, support for floats in the future)
 * - `Variable` for symbols
 * - `Sum` for n-ary addition
 * - `Product` for n-ary multiplication. Subtraction is represented by a negative coefficient
 * - `Quotient` for division
 * - `Exponent` for exponentiation
 * - `Fn` for functions, which can be configured
 * @property {'expression'} type
 * @property {ExpressionNode} node - the node representing the expression
 */
export class Expression {
    /**
     * get gcd of expressions, returning a negative gcd if all terms are negative
     * @param {Expression[]} exps
     * @returns {Expression}
     */
    static gcd(...exps: Expression[]): Expression;
    /**
     * register a custom simplifier
     *  @argument {(exp: Expression)=>Expression} simplifier
     * 	@returns {void}
     */
    static RegisterCustomSimplifier(simplifier: (exp: Expression) => Expression): void;
    /**
     * deregister the last custom simplifier
     * @returns {void}
     * */
    static DeregisterCustomSimplifier(): void;
    /**
     * register a custom toString function: if the function returns undefined, the default toString will be used
     * @argument {(exp: Expression)=>string|undefined} toStringFn
     * @returns {void}
     * */
    static RegisterCustomToStringFn(toStringFn: (exp: Expression) => string | undefined): void;
    /**
     * deregister the last custom toString function
     * @returns {void}
     * */
    static DeregisterCustomToStringFn(): void;
    /**
     * @constructor
     * Creates an `Expression` instance.
     * You can use shorthands for complicated nodes,
     * though we recommend the sum function for better readability
     *
     * By default, we simplify the expression. Use {verbatim: true} to disable simplification
     *
     * @param {Shorthand} node
     */
    constructor(node: Shorthand);
    /** @type {'expression'} */
    type: "expression";
    /** @type {ExpressionNode} */
    node: ExpressionNode;
    /**
     * @returns {Expression} a clone of the current instance
     */
    clone(): Expression;
    /**
     * @param {Shorthand} x
     * @param {SimplifyOptions} [options]
     * @return {Expression}
     */
    plus(x: Shorthand, options?: SimplifyOptions | undefined): Expression;
    /**
     * @param {Shorthand} x
     * @param {SimplifyOptions} [options]
     * @return {Expression}
     */
    minus(x: Shorthand, options?: SimplifyOptions | undefined): Expression;
    /**
     * @param {Shorthand} x
     * @param {SimplifyOptions & { expand?: boolean}} [options]
     * @return {Expression}
     */
    times(x: Shorthand, options?: (SimplifyOptions & {
        expand?: boolean;
    }) | undefined): Expression;
    /**
     * @param {Shorthand} x
     * @param {SimplifyOptions} [options]
     * @return {Expression}
     */
    divide(x: Shorthand, options?: SimplifyOptions | undefined): Expression;
    /**
     * @param {SimplifyOptions} [options]
     * @return {Expression}
     */
    negative(options?: SimplifyOptions | undefined): Expression;
    /**
     * @returns {Expression}
     */
    abs(): Expression;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Expression}
     *  */
    reciprocal(options?: SimplifyOptions | undefined): Expression;
    /**
     * @param {Shorthand} n
     * @param {SimplifyOptions} [options]
     * @returns {Expression}
     *  */
    pow(n: Shorthand, options?: SimplifyOptions | undefined): Expression;
    /**
     * @param {SimplifyOptions & {expand?: boolean}} [options]
     * @returns {Expression}
     *  */
    square(options?: (SimplifyOptions & {
        expand?: boolean;
    }) | undefined): Expression;
    /**
     * @param {number} x
     * @param {string|Variable} [variable]
     * @returns {number}
     */
    fn: (x: number, variable?: string | Variable | undefined) => number;
    /**
     * @returns {Expression}
     */
    positiveIndexNotation(): Expression;
    /**
     * subs in variables for other expressions
     * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
     * @param {SimplifyOptions} [options] - default to automatic simplification
     * @returns {Expression}
     */
    subIn(scope: Record<string, Shorthand>, options?: SimplifyOptions | undefined): Expression;
    /**
     * simplifies the expression
     * @param {SimplifyOptions} [options] - options for which types to simplify
     * @returns {Expression} the current instance after simplification. Note that this method mutates the current instance
     */
    simplify(options?: SimplifyOptions | undefined): Expression;
    /**
     * rearranges the terms of a sum in place
     * TODO: add support for rearranging products
     * WARNING: experimental API to be finalized in the future
     * @param {number[]} order
     * @returns {Expression}
     */
    rearrange(order: number[]): Expression;
    is: {
        /** @returns {boolean} */
        negative: () => boolean;
        /** @returns {boolean} */
        variable: () => boolean;
        /** @returns {boolean} */
        numeral: () => boolean;
        /**
         * whether this expression is a product with coefficient negative one and only one factor
         * @returns {boolean} */
        negativeUnit: () => boolean;
    };
    /** @returns {string} */
    _to_lexical_string(): string;
    /**
     * @param {Shorthand} factor
     * @returns {Expression}
     */
    _divide_by_factor(factor: Shorthand): Expression;
    /**
     *
     * @param {ExpansionOptions} [options] - default to automatic simplification
     * @returns {Expression}
     * */
    expand(options?: ExpansionOptions | undefined): Expression;
    factorize: {
        /**
         * factorizes a sum by extracting common factors
         * @param {SimplifyOptions} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
         * @returns {Expression}
         */
        commonFactor: (options?: SimplifyOptions | undefined) => Expression;
    };
    /**
     * @param {string|Variable} variable
     * @returns {boolean} whether the expression contains the variable
     */
    contains(variable: string | Variable): boolean;
    /**
     * @returns {string} the LaTeX string representation of the expression
     */
    toString(): string;
    /**
     * Returns a custom string representation of the expression, using the provided function.
     * If the function returns undefined, the default toString will be used
     * @param {(exp:Expression)=>string|undefined} toStringFn
     * @returns {string}
     */
    toCustomString(toStringFn: (exp: Expression) => string | undefined): string;
    /** @return {number} */
    valueOf(): number;
    /**
     * @param {number} [precision] - the number of significant digits
     *  @return {string}
     * */
    toPrecision(precision?: number | undefined): string;
    /**
     * @param {number} [fractionDigits]
     *  @return {string}
     * */
    toFixed(fractionDigits?: number | undefined): string;
    /** @returns {[Expression, Expression]} */
    _getQuotientTerms(): [Expression, Expression];
    /** @returns {[Expression, Expression]} */
    _getExponentTerms(): [Expression, Expression];
    /** @returns {Numeral} */
    _getNumeral(): Numeral;
    /** @return {[Numeral, Expression[]]} */
    _getProductTerms(): [Numeral, Expression[]];
    /** @return {Expression} */
    _getProductTerm(): Expression;
    /** @return {Expression[]} */
    _getSumTerms(): Expression[];
    /**
     * if the expression is a product, returns the expression with coefficient 1
     * @returns {Expression}
     */
    unit(): Expression;
}
export const e: Variable;
export const i: Variable;
export const pi: Variable;
export type ExpressionNode = Variable | Numeral | Sum | Product | Quotient | Exponent | Fn;
export type SumShorthand = ["+", ...(number | string | Shorthand)[]];
export type ProductShorthand = (number | string | Shorthand)[];
export type QuotientShorthand = [Shorthand, "/", Shorthand];
export type ExponentShorthand = [Shorthand, "^", Shorthand];
export type Shorthand = number | string | ExpressionNode | Expression | ProductShorthand | SumShorthand | QuotientShorthand | ExponentShorthand;
export type SimplifyOptions = {
    verbatim?: boolean | "quotient";
};
export type ExpansionOptions = {
    verbatim?: boolean | "quotient";
    numeratorOnly?: boolean;
    onlyLinear?: boolean;
};
import { Numeral } from './numeral/numeral.js';
import { Variable } from './variable/variable.js';
import { Fn } from './fn/custom-function.js';
import { Exponent } from './exponent/exponent.js';
import { Product } from './product/product.js';
import { Quotient } from './quotient/quotient.js';
import { Sum } from './sum/sum.js';
export { Numeral, Variable, Fn, Exponent, Product, Quotient, Sum };
//# sourceMappingURL=expression.d.ts.map