/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').Variable} Variable */
/**
 * The `Exponent` class represents a base raised to a power
 * @property {'exponent'} type
 * @property {Expression} base
 * @property {Expression} power
 * */
export class Exponent {
    /**
     * Creates a Quotient
     * @param {Expression} base
     * @param {Expression} power
     */
    constructor(base: Expression, power: Expression);
    /** @type {'exponent'} */
    type: "exponent";
    /**@type {Expression} */
    base: Expression;
    /**@type {Expression} */
    power: Expression;
    /**
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    is: {
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /** @returns {string} */
    toString(): string;
    /** @returns {string} */
    _to_lexical_string(): string;
    /** @returns {Exponent} */
    clone(): Exponent;
    /**
     * @param {import('../expression.js').SimplifyOptions} [options]
     * @returns {Exponent}
     */
    simplify(options?: import("../expression.js").SimplifyOptions | undefined): Exponent;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean|'quotient'}} options
     * @returns {Exponent}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean | "quotient";
    }): Exponent;
    /**
     * @param {number} x
     * @param {string|Variable} [variable]
     * @returns {number}
     */
    fn: (x: number, variable?: string | import("../expression.js").Variable | undefined) => number;
    /**
     * @returns {number}
     */
    valueOf(): number;
}
export type Expression = import("../expression.js").Expression;
export type Variable = import("../expression.js").Variable;
//# sourceMappingURL=exponent.d.ts.map