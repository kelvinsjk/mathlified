/**
 * The `Fraction` class represents a rational number
 * @property {'fraction'} type
 * @property {number} num - the numerator
 * @property {number} den - the denominator
 *
 */
export class Fraction {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
     * @param {Fraction} frac
     * @returns {number} 1 or -1, depending on the sign. 0 or -0 are returned as-is.
     */
    static sign(frac: Fraction): number;
    /**
     * (absolute) gcd of fractions
     * @param {...(Fraction|number)} fractions
     * @returns {Fraction}
     */
    static gcd(...fractions: (Fraction | number)[]): Fraction;
    /**
     * lcm of fractions
     * @param {...(Fraction|number)} fractions
     * @returns {Fraction}
     */
    static lcm(...fractions: (Fraction | number)[]): Fraction;
    /**
     * @constructor
     * Creates a `Fraction` instance
     * @param {number} num - numerator
     * @param {number} [den=1] - denominator
     */
    constructor(num: number, den?: number | undefined);
    /** @type {'fraction'} */
    type: "fraction";
    /** @type {number} */
    num: number;
    /** @type {number} */
    den: number;
    /**
     * simplifies fraction such that
     * (1) denominators are positive
     * (2) gcd(num, den) = 1
     * @param {import('../../expression.js').SimplifyOptions} [options]
     * @returns {Fraction}
     */
    simplify(options?: import("../../expression.js").SimplifyOptions | undefined): Fraction;
    /**
     * @returns {Fraction}
     */
    clone(): Fraction;
    /**
     * returns the float representation of this fraction
     * @returns {number}
     */
    valueOf(): number;
    /**
     * returns the latex string representing this fraction
     * @param {{mixedFractions?: boolean}} [options] - default: `{mixedFractions: false}`
     * @returns {string}
     */
    toString(options?: {
        mixedFractions?: boolean;
    } | undefined): string;
    /**
     * @param {number} digits
     * @returns {string}
     */
    toFixed(digits: number): string;
    /**
     * @param {number} precision
     * @returns {string}
     */
    toPrecision(precision: number): string;
    is: {
        /** @returns {boolean} */
        positive: () => boolean;
        /** @returns {boolean} */
        negative: () => boolean;
        /** @returns {boolean} */
        non_negative: () => boolean;
        /** @returns {boolean} */
        zero: () => boolean;
        /** @returns {boolean} */
        nonzero: () => boolean;
        /** @returns {boolean} */
        integer: () => boolean;
        /** @returns {boolean} */
        one: () => boolean;
        /** @returns {boolean} */
        negative_one: () => boolean;
    };
    /**
     * sum of two fractions
     * @param {Fraction} x - the fraction to add
     * @returns {Fraction}
     */
    plus(x: Fraction): Fraction;
    /**
     * product of two fractions
     * @param {Fraction} x - the fraction to multiply
     * @returns {Fraction}
     */
    times(x: Fraction): Fraction;
    /**
     * power of this fraction
     * @param {number|Fraction} n - the power to raise to
     * @returns {Fraction}
     */
    pow(n: number | Fraction): Fraction;
    /**
     * reciprocal of this fraction
     * @returns {Fraction}
     */
    reciprocal(): Fraction;
    /**
     * division
     * @param {Fraction} x - the fraction to divide by
     */
    divide(x: Fraction): Fraction;
    /**
     * absolute value of this fraction
     * @returns {Fraction}
     */
    abs(): Fraction;
    /**
     * negation of this fraction
     * @returns {Fraction}
     */
    negative(): Fraction;
    #private;
}
//# sourceMappingURL=fraction.d.ts.map