/**
 * The `Variable` class represents a mathematical symbol
 * @property {'variable'} type
 * @property {string} name - the string representation of the variable
 * */
export class Variable {
    /**
     * @constructor
     * Creates a Variable
     * @param {string} name - the string representation of the variable
     * @param {{constantValue?: number, typesetString?: string}} [options] - options to identify as a constant value or to set a custom typeset string
     */
    constructor(name: string, options?: {
        constantValue?: number;
        typesetString?: string;
    } | undefined);
    /** @type {'variable'} */
    type: "variable";
    /** @type {number|undefined} */
    constantValue: number | undefined;
    /** @type {string|undefined} */
    typesetString: string | undefined;
    name: string;
    simplify(): this;
    /**
     * @returns {string} `this.name`
     */
    toString(): string;
    /** @returns {string} */
    _to_lexical_string(): string;
    get options(): {
        constantValue: number | undefined;
        typesetString: string | undefined;
    };
    /**
     * @returns {Variable}
     */
    clone(): Variable;
    is: {
        /** @returns {boolean} */
        variable: () => boolean;
    };
    /**
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * @param {number} x
     * @param {string|Variable} [variable]
     * @returns {number}
     */
    fn: (x: number, variable?: string | Variable | undefined) => number;
    /**
     * @returns {number}
     */
    valueOf(): number;
}
//# sourceMappingURL=variable.d.ts.map