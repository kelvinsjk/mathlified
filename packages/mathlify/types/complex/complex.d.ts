/**
 * Simplifies
 * - i^2 into -1
 * - sqrt{a}^2 into a
 * @param {Expression} expression
 * @returns {Expression}
 */
export function simplifyComplex(expression: Expression): Expression;
/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
export const i: Variable;
export class Complex extends Expression {
    /**
     * @param {string} [x='x']
     * @param {string} [y='y']
     * @returns {Complex}
     */
    static Cartesian(x?: string | undefined, y?: string | undefined): Complex;
    /**
     * @param {string} [r='r']
     * @param {string|Variable} [theta]
     */
    static Exponential(r?: string | undefined, theta?: string | Variable | undefined): Complex;
    static I: Complex;
    /**
     * @param {Shorthand} xOrR
     * @param {Shorthand} yOrTheta
     * @param {{polar?: boolean}} [options] - defaults to cartesian mode
     */
    constructor(xOrR: Shorthand, yOrTheta: Shorthand, options?: {
        polar?: boolean;
    } | undefined);
    /** @type {'cartesian'|'exponential'} */
    form: "cartesian" | "exponential";
    /** @type {[Expression, Expression]} (x,y) or (r, theta) depending on form */
    components: [Expression, Expression];
    get real(): Expression;
    get imag(): Expression;
    get mod(): Expression;
    get arg(): Expression;
    /**
     * @returns {Complex}
     */
    conjugate(): Complex;
    /**
     * @param {Complex} z2
     */
    times(z2: Complex): Complex;
    /**
     * @param {Complex} z2
     */
    divide(z2: Complex): Complex;
    /**
     * @param {Shorthand} n
     */
    pow(n: Shorthand): Complex;
    /**
     * @returns {Complex}
     */
    toExponential(): Complex;
    /**
     * @returns {Complex}
     */
    toCartesian(): Complex;
    clone(): Complex;
}
export type Shorthand = import("../core/expression/expression.js").Shorthand;
import { Expression } from '../core/expression/expression.js';
import { Variable } from '../core/expression/expression.js';
//# sourceMappingURL=complex.d.ts.map