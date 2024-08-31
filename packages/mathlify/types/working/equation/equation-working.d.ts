/**
 * Helps set up in-between inequalities
 * @param {Sign} sign
 * @returns {'<'|'<='}
 */
export function switchToLessThan(sign: Sign): "<" | "<=";
export { Equation };
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
/** @typedef {import('./equation.js').Sign} Sign */
/** @typedef {{hide?: boolean, string?: boolean, swapSides?: true}} WorkingOptions */
/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class EquationWorking {
    /**
     * register a custom simplifier
     *  @argument {(exp: Expression)=>Expression} simplifier
     * 	@returns {void}
     */
    static RegisterCustomSimplifier(simplifier: (exp: Expression) => Expression): void;
    /**
     * deregister the last custom simplifier
     * @returns {void}
     * */
    static DeregisterCustomSimplifier(): void;
    /**
     * Creates an ExpressionWorking
     * @param {Equation|Shorthand} lhs - the initial expression on the left
     * @param {Shorthand} [rhs=0] - the initial expression on the right. (ignored if Equation supplied for previous argument)
     * @param {{sign?: Sign, aligned?: boolean, hideFirstStep?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
     */
    constructor(lhs: Equation | Shorthand, rhs?: import("../../core/expression/expression.js").Shorthand | undefined, options?: {
        sign?: Sign;
        aligned?: boolean;
        hideFirstStep?: boolean;
    } | undefined);
    /** @type {Equation} the current equation */
    eqn: Equation;
    /** @type {[(Expression|string), Sign, (Expression|string)][]} array of the lhs/rhs expressions on each step */
    eqns: [(Expression | string), Sign, (Expression | string)][];
    /** @type {boolean}	 */
    aligned: boolean;
    /** @type {[number[], string[]]} */
    interjections: [number[], string[]];
    /**
     * @returns {EquationWorking}
     */
    clone(): EquationWorking;
    /**
     * @param {WorkingOptions} [options]
     */
    removeLogarithm(options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
     * @param {WorkingOptions & {verbatim?: boolean, showSteps?: boolean}} [options] - default to automatic simplification
     * @returns {EquationWorking}
     */
    subIn(scope: Record<string, Shorthand>, options?: (WorkingOptions & {
        verbatim?: boolean;
        showSteps?: boolean;
    }) | undefined): EquationWorking;
    /** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
    /**
     * @param {WorkingOptions & SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
     * @returns {EquationWorking}
     * */
    simplify(options?: (WorkingOptions & import("../../core/expression/expression.js").SimplifyOptions) | undefined): EquationWorking;
    /**
     *
     * @param {number|number[]|[number[], number[]]} indices
     * @param {WorkingOptions & {fromRight?: boolean}} [options] - default from lhs
     * @returns {EquationWorking}
     */
    moveTerms(indices: number | number[] | [number[], number[]], options?: (WorkingOptions & {
        fromRight?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    swapSides(options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {Shorthand} exp
     * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options]
     * @returns {EquationWorking}
     */
    times(exp: Shorthand, options?: (WorkingOptions & {
        verbatim?: boolean;
        expand?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {Shorthand} exp
     * @param {WorkingOptions & {verbatim?: boolean}} [options]
     * @returns {EquationWorking}
     */
    minus(exp: Shorthand, options?: (WorkingOptions & {
        verbatim?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options]
     * @returns {EquationWorking}
     */
    square(options?: (WorkingOptions & {
        verbatim?: boolean;
        expand?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {Shorthand} exp
     * @param {WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    divide(exp: Shorthand, options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {Shorthand} exp
     * @param {WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    divideByFactor(exp: Shorthand, options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
     * @returns {EquationWorking}
     */
    crossMultiply(options?: (WorkingOptions & {
        verbatim?: boolean;
        expand?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {WorkingOptions & import('../../core/expression/expression.js').ExpansionOptions} [options]
     * @returns {EquationWorking}
     */
    expand(options?: (WorkingOptions & import("../../core/expression/expression.js").ExpansionOptions) | undefined): EquationWorking;
    /**
     * isolate variable such that only terms with the variable are on the lhs
     * @param {string|Variable} [variable='x'] - defaults to 'x'
     * @param {WorkingOptions & { steps?: boolean; targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
     * @returns {EquationWorking}
     */
    isolate(variable?: string | import("../../index.js").Variable | undefined, options?: (WorkingOptions & {
        steps?: boolean;
        targetRight?: boolean;
    }) | undefined): EquationWorking;
    /**
     * make rhs = 0 by subtracting rhs from both sides
     * @param {WorkingOptions} [options] - options to hide this step, or to target rhs (defaults to lhf)
     * @returns {EquationWorking}
     */
    makeRhsZero(options?: WorkingOptions | undefined): EquationWorking;
    factorize: {
        /**
         * factorizes by taking out common factor
         * @param {WorkingOptions & {targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        commonFactor: (options?: (WorkingOptions & {
            targetRight?: boolean;
            verbatim?: boolean;
        }) | undefined) => EquationWorking;
        /**
         * @param {WorkingOptions & {targetRight?: boolean, variable?: string|Variable}} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        quadratic: (options?: (WorkingOptions & {
            targetRight?: boolean;
            variable?: string | Variable;
        }) | undefined) => EquationWorking;
        /**
         * @param {'lhs'|'rhs'|{lhs: number[]}|{rhs: number[]}} target - lhs/rhs (quotient) or an array if the target is a sum
         * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
         * @param {WorkingOptions & {targetRight?: boolean}} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        denominator: (target: "lhs" | "rhs" | {
            lhs: number[];
        } | {
            rhs: number[];
        }, method?: "commonFactor" | "quadratic" | undefined, options?: (WorkingOptions & {
            targetRight?: boolean;
        }) | undefined) => EquationWorking;
        /**
         * @param {'lhs'|'rhs'} [target='lhs'] - lhs/rhs (quotient) or an array if the target is a sum
         * @param {'commonFactor'|'quadratic'|'auto'} [method='auto'] - auto method tries quadratic factorization, followed by common factor factorization
         * @param {WorkingOptions} [options] - targets lhs by default
         * @returns {EquationWorking}
         * */
        fraction: (target?: "rhs" | "lhs" | undefined, method?: "commonFactor" | "quadratic" | "auto" | undefined, options?: WorkingOptions | undefined) => EquationWorking;
    };
    /**
     * make subject from product
     * Experimental API
     * @param {string|Variable} [variable='x'] - defaults to 'x'
     * @param {WorkingOptions & { steps?: 'fraction'|'divide'|'postMultiply'|'preMultiply'; targetRight?: boolean, forceSignChange?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
     * @returns {EquationWorking}
     */
    _makeSubjectFromProduct(variable?: string | import("../../index.js").Variable | undefined, options?: (WorkingOptions & {
        steps?: "fraction" | "divide" | "postMultiply" | "preMultiply";
        targetRight?: boolean;
        forceSignChange?: boolean;
    }) | undefined): EquationWorking;
    /**
     * @param {string} text
     * @returns {this}
     */
    interject(text: string): this;
    /**
     * @param {number[]} order
     * @param {{targetRight?: boolean} & WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    rearrange(order: number[], options?: ({
        targetRight?: boolean;
    } & WorkingOptions) | undefined): EquationWorking;
    /**
     * @param {WorkingOptions} [options] - default to target lhs
     * @returns {EquationWorking}
     */
    positiveIndexNotation(options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {{target?: 'l'|'r'|'b'} & WorkingOptions} [options] default to target both
     * @returns {EquationWorking}
     */
    combineFraction(options?: ({
        target?: "l" | "r" | "b";
    } & WorkingOptions) | undefined): EquationWorking;
    /**
     *
     * @param {WorkingOptions & {target?: 'l'|'r'|'b'}} [options]
     * @returns {EquationWorking}
     */
    toPolynomial(options?: (WorkingOptions & {
        target?: "l" | "r" | "b";
    }) | undefined): EquationWorking;
    /**
     * @param {string} [variable='x']
     * @param {WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    toGeneralPolynomial(variable?: string | undefined, options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {WorkingOptions} [options]
     * @returns {EquationWorking}
     */
    inverse(options?: WorkingOptions | undefined): EquationWorking;
    solve: {
        /**
         * @param {string} [variable='x']
         * @param {{hideFirstLine?: boolean, aligned?: boolean, qed?: true|string}} [options]
         * @returns {EquationWorking & {root: Expression}}
         */
        linear: (variable?: string | undefined, options?: {
            hideFirstLine?: boolean;
            aligned?: boolean;
            qed?: true | string;
        } | undefined) => EquationWorking & {
            root: Expression;
        };
        /**
         * @param {string} [variable] - we will use variable if exp not of Polynomial class
         * @param {{hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
         * @returns {EquationWorking & {rootsWorking:string, roots: Expression[]}}
         */
        quadratic: (variable?: string | undefined, options?: {
            hideFirstStep?: boolean;
            aligned?: boolean;
            qed?: true | string;
        } | undefined) => EquationWorking & {
            rootsWorking: string;
            roots: Expression[];
        };
        /**
         * @param {string} [variable] - we will use variable if exp not of Polynomial class
         * @param {{sign?: Sign, hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
         * @returns {EquationWorking & {answers: string[], roots: [Numeral, Numeral]}}
         */
        quadraticInequality: (variable?: string | undefined, options?: {
            sign?: Sign;
            hideFirstStep?: boolean;
            aligned?: boolean;
            qed?: true | string;
        } | undefined) => EquationWorking & {
            answers: string[];
            roots: [Numeral, Numeral];
        };
    };
    /**
     * @param {string} [variable='x']
     * @param {WorkingOptions} [options]
     */
    differentiate(variable?: string | undefined, options?: WorkingOptions | undefined): EquationWorking;
    /**
     * @param {(exp:Expression)=>string|undefined} toStringFn
     * @return {string}
     */
    toCustomString(toStringFn: (exp: Expression) => string | undefined): string;
    /**
     *
     * @return {string}
     */
    toString(): string;
    /**
     * @returns {string[]}
     */
    _to_string_array(): string[];
    /**
     * @param {Equation|Shorthand|string|number} lhs
     * @param {Shorthand} [rhs] - defaults to original rhs
     * @param {{sign?: Sign} & WorkingOptions} [options]
     * @return {EquationWorking}
     */
    addCustomStep(lhs: Equation | Shorthand | string | number, rhs?: import("../../core/expression/expression.js").Shorthand | undefined, options?: ({
        sign?: Sign;
    } & WorkingOptions) | undefined): EquationWorking;
}
export namespace solve {
    function linear(expression: Expression | Equation | Shorthand, variable?: string | import("../../index.js").Variable | undefined, options?: {
        hideFirstLine?: boolean;
        aligned?: boolean;
        qed?: true | string;
    } | undefined): {
        working: EquationWorking;
        root: Expression;
    };
    function zeroProduct(expression: Expression | Equation, variable?: string | import("../../index.js").Variable | undefined, options?: {
        hideFirstLine?: boolean;
        aligned?: boolean;
        qed?: true | string;
    } | undefined): {
        working: string;
        roots: Expression[];
    };
    function quadratic(exp: Expression | Polynomial | Equation | [Expression, Expression], variable?: string | import("../../index.js").Variable | undefined, options?: {
        hideFirstStep?: boolean;
        aligned?: boolean;
        qed?: true | string;
    } | undefined): {
        factorizationWorking: EquationWorking;
        rootsWorking: string;
        roots: Expression[];
    };
    function quadraticInequality(exp: Expression | Polynomial | Equation | [Expression, Sign, Expression], variable?: string | import("../../index.js").Variable | undefined, options?: {
        sign?: Sign;
        hideFirstStep?: boolean;
        aligned?: boolean;
        qed?: true | string;
    } | undefined): {
        working: EquationWorking;
        answers: string[];
        roots: [Numeral, Numeral];
    };
    function rationalInequality(exp: Expression | Polynomial | Equation | [Expression, Sign, Expression], variable?: string | import("../../index.js").Variable | undefined, options?: {
        sign?: Sign;
        hideFirstStep?: boolean;
        aligned?: boolean;
        qed?: true | string;
    } | undefined): {
        working: EquationWorking;
        answers: string[];
        roots: Numeral[];
    };
}
export type Shorthand = import("../../core/expression/expression.js").Shorthand;
export type Variable = import("../../core/expression/expression.js").Variable;
export type Sign = import("./equation.js").Sign;
export type WorkingOptions = {
    hide?: boolean;
    string?: boolean;
    swapSides?: true;
};
import { Equation } from './equation.js';
import { Expression } from '../../index.js';
import { Numeral } from '../../core/expression/expression.js';
import { Polynomial } from '../../index.js';
//# sourceMappingURL=equation-working.d.ts.map