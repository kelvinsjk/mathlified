/** @typedef {import('../expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression/expression.js').Shorthand} Shorthand */
/** The GeneralPolynomial class is a single-variable polynomial with coefficients that are arbitrary expression */
export class Polynomial extends Expression {
    /**
     *
     * @param {number} n
     * @param {{coeff?: number|Numeral|Expression, ascending?: boolean, variable?: string|Variable}} [options] coeff defaults to 1
     * @returns {Polynomial}
     */
    static ofDegree(n: number, options?: {
        coeff?: number | Numeral | Expression;
        ascending?: boolean;
        variable?: string | Variable;
    } | undefined): Polynomial;
    /**
     *
     * @param {number|Numeral|Expression|[number,number]} root
     * @param {{variable?: string}} [options] coeff defaults to 1
     */
    static fromRoot(root: number | Numeral | Expression | [number, number], options?: {
        variable?: string;
    } | undefined): Polynomial;
    /**
     * @param {Shorthand[]|string} coeffs
     * @param { {ascending?: boolean, variable?: string|Variable} } [options] - defaults to ascending polynomial with variable 'x'
     * WARNING: do ensure that the coefficients are free of the variable. we currently do not check for this.
     */
    constructor(coeffs: Shorthand[] | string, options?: {
        ascending?: boolean;
        variable?: string | Variable;
    } | undefined);
    /** @type {ExpressionNode[]} coeffs in ascending order */
    coeffs: ExpressionNode[];
    /** @type {string|Variable} */
    variable: string | Variable;
    /** @type {boolean} */
    _ascending: boolean;
    get degree(): number;
    get options(): {
        ascending: boolean;
        variable: string | Variable;
    };
    /**
     * @param {boolean} asc
     */
    set ascending(asc: boolean);
    /**
     * @returns {Polynomial}
     */
    negative(): Polynomial;
    /**
     * @overload
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    plus(p2: number | Polynomial): Polynomial;
    /**
     * @overload
     * @param {Expression} p2
     * @returns {Expression}
     */
    plus(p2: Expression): Expression;
    /**
     *
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    minus(p2: number | Polynomial): Polynomial;
    /**
     * @param {number|Numeral|Polynomial} p2 - Expression must be a numeral
     * @returns {Polynomial}
     */
    times(p2: number | Numeral | Polynomial): Polynomial;
    /**
     * @returns {Polynomial}
     */
    square(): Polynomial;
    /**
     * divides the polynomial by a number
     * @param {number|Numeral} num
     * @returns {Polynomial}
     */
    divide(num: number | Numeral): Polynomial;
    factorize: {
        /**
         * @param {{forcePositiveLeadingCoefficient?: boolean, verbatim?: boolean|'quotient'}} [options]
         * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
         */
        commonFactor: (options?: {
            forcePositiveLeadingCoefficient?: boolean;
            verbatim?: boolean | "quotient";
        } | undefined) => Expression & {
            commonFactor: Polynomial;
            remainingFactor: Polynomial;
        };
        /**
         * returns factorized expression of the form k(ax-b)(cx-d) where a,b,c,d \in \mathbb{Z} and gcd(a,b)=gcd(c,d)=1 and d=0 or b/a < d/c. if equal roots, will return k(ax-b)^2
         * special exception: expressions like 4-x^2 factorize to (2+x)(2-x) rather than -(x+2)(x-2)
         * @returns {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}}
         */
        quadratic: () => Expression & {
            factors: [Polynomial, Polynomial];
            multiple: Numeral;
        };
    };
    solve: {
        /**
         * @param {number|Polynomial|Expression} [rhs=0] - if in Expression type, only support Numerals
         * @returns {Expression}
         */
        linear: (rhs?: number | Expression | Polynomial | undefined) => Expression;
        /**
         *
         * @param {number|Polynomial} [rhs=0]
         * @returns {[Expression, Expression, 'rational']} such that either root1 = 0 or root1 \leq root2
         * TODO: allow options to modify output types
         * TODO: ensure integer discriminant
         */
        quadratic: (rhs?: number | Polynomial | undefined) => [Expression, Expression, "rational"];
    };
    /**
     * @param {number|Numeral} x
     * @returns {Numeral}
     */
    evaluate(x: number | Numeral): Numeral;
    /** @returns {Expression} */
    quadraticDiscriminant(): Expression;
    /** @returns {ExpressionNode} */
    get leadingCoefficient(): ExpressionNode;
    /** @returns {ExpressionNode} */
    get constantTerm(): ExpressionNode;
    /** @returns {Polynomial} */
    clone(): Polynomial;
    /**
     * @param {Polynomial} divisor
     * @returns {{quotient: Polynomial, remainder: Polynomial, result: Expression}}
     */
    longDivide(divisor: Polynomial): {
        quotient: Polynomial;
        remainder: Polynomial;
        result: Expression;
    };
}
export type ExpressionNode = import("../expression/expression.js").ExpressionNode;
export type Shorthand = import("../expression/expression.js").Shorthand;
import { Expression } from '../expression/expression.js';
import { Variable } from '../expression/expression.js';
import { Numeral } from '../expression/expression.js';
//# sourceMappingURL=polynomial.d.ts.map