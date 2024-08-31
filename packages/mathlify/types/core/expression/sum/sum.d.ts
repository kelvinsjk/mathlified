/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../numeral/fraction/fraction.js').Fraction} Fraction */
/** @typedef {import('../variable/variable.js').Variable} Variable */
/**
 * The `Sum` class represents a sum as an array of terms
 * @property {Expression[]} _termsExp - the terms in the sum
 * */
export class Sum {
    /**
     * Creates a Sum
     * @param {...Expression} terms
     */
    constructor(...terms: Expression[]);
    /** @type {'sum'} */
    type: "sum";
    /**@type {Expression[]} */
    terms: Expression[];
    /**
     * @param {import('../expression.js').SimplifyOptions} [options]
     * @returns {Sum} */
    negative(options?: import("../expression.js").SimplifyOptions | undefined): Sum;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @param {import('../expression.js').SimplifyOptions} [options]
     * @returns {Sum}
     */
    simplify(options?: import("../expression.js").SimplifyOptions | undefined): Sum;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean|'quotient'}} options
     * @returns {Sum}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean | "quotient";
    }): Sum;
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
    is: {
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /**
     * rearranges the terms
     * @param {number[]} order - index of term to be placed in order. eg [1, 0, 2] means the we new terms be the original 2nd, 1st, 3rd terms
     * @returns {Sum}
     * WARNING: we do not check if indices given are valid
     */
    rearrange(order: number[]): Sum;
    /**
     *
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * @returns {string}
     */
    _to_lexical_string(): string;
    /**
     * @returns {Sum}
     */
    clone(): Sum;
    /**
     * flattens sum
     * @returns {this}
     * WARNING: mutates current instance
     */
    _flatten(): this;
    #private;
}
export type Expression = import("../expression.js").Expression;
export type ExpressionNode = import("../expression.js").ExpressionNode;
export type Fraction = import("../numeral/fraction/fraction.js").Fraction;
export type Variable = import("../variable/variable.js").Variable;
//# sourceMappingURL=sum.d.ts.map