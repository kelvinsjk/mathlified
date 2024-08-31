/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../variable/variable.js').Variable} Variable */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression.js').SimplifyOptions} SimplifyOptions */
/**
 * The `Product` class represents a product as a numerical coefficient and an array of factors
 * @property {Numeral} coeff - the coefficient of the product
 * @property {Expression[]} _factorsExp - the factors in the product
 * */
export class Product {
    /**
     * Creates a Product
     * @param {[number|Numeral|Expression, ...Expression[]]|Expression[]} factors
     */
    constructor(...factors: [number | Numeral | Expression, ...Expression[]] | Expression[]);
    /** @type {'product'} */
    type: "product";
    /** @type {Numeral} */
    coeff: Numeral;
    /**@type {Expression[]} */
    factors: Expression[];
    /**
     * @param {{multiplicationSign?: string}} [options] - default to ''
     * @returns {string}
     */
    toString(options?: {
        multiplicationSign?: string;
    } | undefined): string;
    /**
     *
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * @param {{coeff?: boolean}} [options] - whether to include coefficient. default: true
     * @returns {string}
     */
    _to_lexical_string(options?: {
        coeff?: boolean;
    } | undefined): string;
    /**
     * @returns {Product}
     */
    clone(): Product;
    is: {
        /**
         * checks if coefficient is negative
         * @return {boolean}
         * */
        negative: () => boolean;
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /** @returns {Product} */
    negative(): Product;
    /** @returns {Product} */
    abs(): Product;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {Product}
     */
    simplify(options?: import("../expression.js").SimplifyOptions | undefined): Product;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean|'quotient'}} options
     * @returns {Product}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean | "quotient";
    }): Product;
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
    /**
     * flattens product (no product within products)
     * @returns {this}
     * ! Warning: mutates current instance
     */
    _flatten(): this;
}
export type Expression = import("../expression.js").Expression;
export type Variable = import("../variable/variable.js").Variable;
export type ExpressionNode = import("../expression.js").ExpressionNode;
export type SimplifyOptions = import("../expression.js").SimplifyOptions;
import { Numeral } from '../numeral/numeral.js';
//# sourceMappingURL=product.d.ts.map