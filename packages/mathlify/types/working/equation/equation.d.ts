/**
 * @param {Sign} sign
 * @returns {Sign}
 */
export function switchInequalitySign(sign: Sign): Sign;
/**
 * @param {Sign} sign
 * @returns {string}
 */
export function signToLaTeX(sign: Sign): string;
/** @typedef {'='|'>'|'>='|'<'|'<='|'!='} Sign */
/**
 * The `Equation` class handles two expressions on either side of an equation
 */
export class Equation {
    /**
     * Creates an Equation
     * @param {Shorthand} lhs - the initial expression on the left
     * @param {Shorthand} [rhs=0] - the initial expression on the right
     * @param {{aligned?: boolean, sign?: Sign }} [options] - aligned: true adds the & before =. Defaults to false
     */
    constructor(lhs: Shorthand, rhs?: import("../../core/expression/expression.js").Shorthand | undefined, options?: {
        aligned?: boolean;
        sign?: Sign;
    } | undefined);
    /** @type {Expression} the expression on the left*/
    lhs: Expression;
    /** @type {Expression} the expression on the right*/
    rhs: Expression;
    /** @type {Sign} */
    sign: Sign;
    /** @type {boolean} */
    aligned: boolean;
    /** @returns {'equation'|'inequality'} */
    get type(): "equation" | "inequality";
    /**
     * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
     * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after substitution
     * @returns {Equation}
     */
    subIn(scope: {
        [x: string]: Shorthand;
    }, options?: {
        verbatim?: boolean;
    } | undefined): Equation;
    /** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
    /**
     * simplifies the equation: warning: mutates current equation
     * @param {SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {Equation}
     * */
    simplify(options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Equation;
    /**
     *
     * @param {Shorthand} exp
     * @returns {Equation}
     */
    plus(exp: Shorthand): Equation;
    /**
     *
     * @param {Shorthand} exp
     * @param {{verbatim?: boolean}} [options]
     * @returns {Equation}
     */
    minus(exp: Shorthand, options?: {
        verbatim?: boolean;
    } | undefined): Equation;
    /**
     *
     * @param {Shorthand} exp
     * @param {{verbatim?: boolean, expand?: boolean}} [options]
     * @returns {Equation}
     */
    times(exp: Shorthand, options?: {
        verbatim?: boolean;
        expand?: boolean;
    } | undefined): Equation;
    /**
     *
     * @param {{verbatim?: boolean, expand?: boolean}} [options]
     * @returns {Equation}
     */
    square(options?: {
        verbatim?: boolean;
        expand?: boolean;
    } | undefined): Equation;
    /**
     * @param {Shorthand} n
     * @param {SimplifyOptions} [options]
     * @returns {Equation}
     */
    pow(n: Shorthand, options?: import("../../core/expression/expression.js").SimplifyOptions | undefined): Equation;
    /**
     *
     * @param {Shorthand} exp
     * @returns {Equation}
     */
    divide(exp: Shorthand): Equation;
    /**
     * @param {Shorthand} exp
     * @returns {Equation}
     * WARNING: does not handle sign changes
     */
    divideByFactor(exp: Shorthand): Equation;
    /**
     * @param {import('../../core/expression/expression.js').ExpansionOptions} [options]
     * @returns {Equation}
     */
    expand(options?: import("../../core/expression/expression.js").ExpansionOptions | undefined): Equation;
    /**
     * @returns {Equation}
     */
    removeLogarithm(): Equation;
    /**
     * @param {string} [variable='x']
     */
    differentiate(variable?: string | undefined): Equation;
    /**
     * @param {{target?: 'l'|'r'|'b'}} [options] default to the left
     * @returns {Equation}
     */
    toPolynomial(options?: {
        target?: "l" | "r" | "b";
    } | undefined): Equation;
    /**
     * @param {string} [variable='x']
     * @returns {Equation}
     */
    toGeneralPolynomial(variable?: string | undefined): Equation;
    /**
     * for f(x), e^f(x) and ln(f(x)), apply inverses to get
     * x = f^{-1}(y), f(x) = ln(y) and f(x) = e^y
     * @returns {Equation}
     */
    inverse(): Equation;
    factorize: {
        /**
         * factorizes by taking out common factor
         * @param {{targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
         * @returns {Equation}
         * */
        commonFactor: (options?: {
            targetRight?: boolean;
            verbatim?: boolean;
        } | undefined) => Equation;
        /**
         * @param {{targetRight?: boolean}} [options] - targets lhs by default
         * @returns {Equation}
         * */
        quadratic: (options?: {
            targetRight?: boolean;
        } | undefined) => Equation;
        /**
         * @param {'lhs'|'rhs'|{lhs: number[]}|{rhs: number[]}} target - lhs/rhs (quotient) or an array if the target is a sum
         * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
         * @returns {Equation}
         * */
        denominator: (target: "lhs" | "rhs" | {
            lhs: number[];
        } | {
            rhs: number[];
        }, method?: "commonFactor" | "quadratic" | undefined) => Equation;
        /**
         * @param {'lhs'|'rhs'} [target='lhs'] - lhs/rhs (quotient) or an array if the target is a sum
         * @param {'commonFactor'|'quadratic'|'auto'} [_method='auto'] - auto method tries quadratic factorization, followed by common factor factorization
         * @returns {Equation}
         * */
        fraction: (target?: "rhs" | "lhs" | undefined, _method?: "commonFactor" | "quadratic" | "auto" | undefined) => Equation;
    };
    /**
     * @param {number[]} order
     * @param {{targetRight?: boolean}} [options]
     * @returns {Equation}
     */
    rearrange(order: number[], options?: {
        targetRight?: boolean;
    } | undefined): Equation;
    /**
     * @returns {Equation}
     */
    positiveIndexNotation(): Equation;
    /**
     * @returns {Equation}
     */
    swapSides(): Equation;
    /**
     * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
     * @returns {Equation}
     */
    crossMultiply(options?: {
        verbatim?: boolean;
    } | undefined): Equation;
    get options(): {
        aligned: boolean;
        sign: Sign;
    };
    /**
     * @return {string}
     */
    toString(): string;
    /** @return {Equation} */
    clone(): Equation;
}
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type ExpressionNode = import("../../core/expression/expression.js").ExpressionNode;
export type Sign = "=" | ">" | ">=" | "<" | "<=" | "!=";
import { Expression } from '../../core/expression/expression.js';
//# sourceMappingURL=equation.d.ts.map