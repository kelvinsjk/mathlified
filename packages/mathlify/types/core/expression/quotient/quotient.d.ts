/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').Variable} Variable */
/**
 * The `Quotient` class represents a fraction of two expressions
 * @property {'quotient'} type
 * @property {Expression} num - the numerator
 * @property {Expression} den - the denominator
 * */
export class Quotient {
    /**
     * Creates a Quotient
     * @param {Expression} num
     * @param {Expression} den
     */
    constructor(num: Expression, den: Expression);
    /** @type {'quotient'} */
    type: "quotient";
    /**@type {Expression} */
    num: Expression;
    /**@type {Expression} */
    den: Expression;
    reciprocal(): Quotient;
    /**
     *
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * @returns {string}
     */
    toString(): string;
    /** @returns {string} */
    _to_lexical_string(): string;
    /**
     * @returns {Quotient}
     */
    clone(): Quotient;
    /**
     * @param {import('../expression.js').SimplifyOptions} [options]
     * @returns {Quotient}
     */
    simplify(options?: import("../expression.js").SimplifyOptions | undefined): Quotient;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean|'quotient'}} options
     * @returns {Quotient}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean | "quotient";
    }): Quotient;
    /**
     * @param {number} x
     * @param {string|Variable} [variable]
     * @returns {number}
     */
    fn: (x: number, variable?: string | import("../expression.js").Variable | undefined) => number;
    is: {
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /**
     * @returns {number}
     */
    valueOf(): number;
}
export type Expression = import("../expression.js").Expression;
export type Variable = import("../expression.js").Variable;
//# sourceMappingURL=quotient.d.ts.map