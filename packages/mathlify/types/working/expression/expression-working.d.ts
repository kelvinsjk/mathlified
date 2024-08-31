/**
 * ExpressionWorking Class to handle the step-by-step working in manipulating an expression
 */
export class ExpressionWorking {
    /**
     * @type {boolean}
     * If true, starts the working with a.
     */
    /**
     * Creates an ExpressionWorking
     * @param {Shorthand} expression - the initial expression
     * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean, leadingEqual?: boolean}} [options] - lineBreakMode is either 'aligned' (default), 'single' or 'multi'
     */
    constructor(expression: import("../../core/expression/expression.js").Shorthand, options?: {
        lineBreakMode?: LineBreakMode;
        startOnFirstLine?: boolean;
        leadingEqual?: boolean;
    } | undefined);
    /** @type {Expression} the current expression*/
    expression: Expression;
    /** @type {(Expression|string)[]} */
    expressions: (Expression | string)[];
    /**
     * @type {LineBreakMode}
     * aligned: x &= y \\ &= z ...
     * single: x = y = z ...
     * multi: x \\ = y \\ = z ...
     */
    lineBreakMode: LineBreakMode;
    /**
     * @type {boolean}
     * Only applicable for aligned lineBreakMode
     * If true: x &= y \\ &= z ...
     * else: & x \\ &= y \\ &= z ...
     * */
    startOnFirstLine: boolean;
    leadingEqual: boolean;
    /**
     * @typedef {import('../../core/expression/expression').Shorthand} Shorthand
     * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
     * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     */
    subIn(scope: {
        [x: string]: import("../../core/expression/expression.js").Shorthand;
    }, options?: (WorkingOptions & {
        verbatim?: boolean;
    }) | undefined): ExpressionWorking;
    /**
     * @param {WorkingOptions} [options] default to target both
     * @returns {ExpressionWorking}
     */
    combineFraction(options?: WorkingOptions | undefined): ExpressionWorking;
    /**
     * @param {WorkingOptions} [options] default to target both
     * @returns {ExpressionWorking}
     */
    expandNegativeIntoQuotient(options?: WorkingOptions | undefined): ExpressionWorking;
    factorize: {
        /**
         * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
         * @param {WorkingOptions} [options]
         * @returns {ExpressionWorking}
         * */
        denominator: (method?: "commonFactor" | "quadratic" | undefined, options?: WorkingOptions | undefined) => ExpressionWorking;
    };
    /**
     * @param {SimplifyOptions & WorkingOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {ExpressionWorking}
     * */
    simplify(options?: (import("../../core/expression/expression.js").SimplifyOptions & WorkingOptions) | undefined): ExpressionWorking;
    /**
     * @return {string}
     */
    toString(): string;
    /**
     * @param {(exp:Expression)=>string|undefined} toStringFn
     * @return {string}
     */
    toCustomString(toStringFn: (exp: Expression) => string | undefined): string;
    /**
     * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
     * @returns {ExpressionWorking}
     * */
    expand(options?: (WorkingOptions & import("../../core/expression/expression.js").ExpansionOptions) | undefined): ExpressionWorking;
    /**
     * @param {Shorthand} expression
     * @return {ExpressionWorking}
     */
    addCustomStep(expression: import("../../core/expression/expression.js").Shorthand): ExpressionWorking;
}
export type LineBreakMode = "aligned" | "single" | "multi";
export type WorkingOptions = {
    hide?: boolean;
    string?: boolean;
};
export type SimplifyOptions = import("../../core/expression/expression.js").SimplifyOptions;
export type ExpansionOptions = import("../../core/expression/expression.js").ExpansionOptions;
export type Expression = import("../../core/expression/expression.js").Expression;
//# sourceMappingURL=expression-working.d.ts.map