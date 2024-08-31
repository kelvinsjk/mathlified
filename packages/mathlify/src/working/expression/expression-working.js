/** @typedef {'aligned'|'single'|'multi'} LineBreakMode */
/** @typedef {{hide?: boolean, string?: boolean}} WorkingOptions */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').ExpansionOptions} ExpansionOptions */
/** @typedef {import('../../core/expression/expression.js').Expression} Expression */

import { combineFraction } from '../../algebra/combine-fraction.js';
import {
	quotient,
	shorthandToExpression,
} from '../../core/expression/expression.js';
import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';

/**
 * ExpressionWorking Class to handle the step-by-step working in manipulating an expression
 */
export class ExpressionWorking {
	/** @type {Expression} the current expression*/
	expression;
	/** @type {(Expression|string)[]} */
	expressions;

	/**
	 * @type {LineBreakMode}
	 * aligned: x &= y \\ &= z ...
	 * single: x = y = z ...
	 * multi: x \\ = y \\ = z ...
	 */
	lineBreakMode;
	/**
	 * @type {boolean}
	 * Only applicable for aligned lineBreakMode
	 * If true: x &= y \\ &= z ...
	 * else: & x \\ &= y \\ &= z ...
	 * */
	startOnFirstLine;
	/**
	 * @type {boolean}
	 * If true, starts the working with a.
	 */

	/**
	 * Creates an ExpressionWorking
	 * @param {Shorthand} expression - the initial expression
	 * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean, leadingEqual?: boolean}} [options] - lineBreakMode is either 'aligned' (default), 'single' or 'multi'
	 */
	constructor(expression, options) {
		this.expression = shorthandToExpression(expression);
		this.expressions = [this.expression];
		this.lineBreakMode = options?.lineBreakMode ?? 'aligned';
		this.startOnFirstLine = options?.startOnFirstLine ?? false;
		this.leadingEqual = options?.leadingEqual ?? false;
	}

	/**
	 * @typedef {import('../../core/expression/expression').Shorthand} Shorthand
	 * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
	 * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 */
	subIn(scope, options) {
		this.expression = this.expression.subIn(scope, options);
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions} [options] default to target both
	 * @returns {ExpressionWorking}
	 */
	combineFraction(options) {
		this.expression = combineFraction(this.expression);
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions} [options] default to target both
	 * @returns {ExpressionWorking}
	 */
	expandNegativeIntoQuotient(options) {
		if (!this.expression.is.negativeUnit())
			throw new Error('Expected a product with coefficient -1');
		const q = this.expression._getProductTerm();
		if (q.node.type !== 'quotient') throw new Error('Expected a quotient');
		const { num, den } = q.node;
		this.expression = quotient(num.negative().expand(), den);
		return addStep(this, options);
	}

	factorize = {
		/**
		 * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
		 * @param {WorkingOptions} [options]
		 * @returns {ExpressionWorking}
		 * */
		denominator: (method = 'quadratic', options) => {
			if (this.expression.node.type !== 'quotient')
				throw new Error('lhs must be a quotient for target lhs');
			const den = this.expression.node.den;
			const factorizedDen =
				method === 'quadratic'
					? expressionToPolynomial(den).factorize.quadratic()
					: den.factorize.commonFactor();
			this.expression = quotient(
				this.expression.node.num.clone(),
				factorizedDen,
			);
			return addStep(this, options);
		},
	};

	/**
	 * @param {SimplifyOptions & WorkingOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {ExpressionWorking}
	 * */
	simplify(options) {
		this.expression = this.expression.clone().simplify(options);
		return addStep(this, options);
	}

	/**
	 * @return {string}
	 */
	toString() {
		let str = '';
		for (const [i, exp] of this.expressions.entries()) {
			if (this.lineBreakMode === 'single') {
				str += (i === 0 && !this.leadingEqual ? '' : ' = ') + exp.toString();
			} else if (this.lineBreakMode === 'multi') {
				str +=
					i === 0
						? this.leadingEqual
							? '= ' + exp.toString()
							: exp.toString()
						: `\n\t\\\\ = ${exp}`;
				// always 'aligned': if clause for code clarity
			} else if (this.lineBreakMode === 'aligned') {
				if (this.startOnFirstLine) {
					str +=
						i === 0
							? this.leadingEqual
								? '&= ' + exp.toString()
								: exp.toString()
							: i === 1
								? ` &= ${exp}`
								: `\n\t\\\\ &= ${exp}`;
				} else {
					str +=
						i === 0
							? this.leadingEqual
								? `&= ${exp}`
								: `& ${exp}`
							: `\n\t\\\\ &= ${exp}`;
				}
			}
		}
		return str;
	}

	/**
	 * @param {(exp:Expression)=>string|undefined} toStringFn
	 * @return {string}
	 */
	toCustomString(toStringFn) {
		let str = '';
		for (const [i, exp] of this.expressions.entries()) {
			const expStr =
				typeof exp === 'string' ? exp : exp.toCustomString(toStringFn);
			if (this.lineBreakMode === 'single') {
				str += (i === 0 && !this.leadingEqual ? '' : ' = ') + expStr;
			} else if (this.lineBreakMode === 'multi') {
				str +=
					i === 0
						? this.leadingEqual
							? '= ' + expStr
							: expStr
						: `\n\t\\\\ = ${expStr}`;
				// always 'aligned': if clause for code clarity
			} else if (this.lineBreakMode === 'aligned') {
				if (this.startOnFirstLine) {
					str +=
						i === 0
							? this.leadingEqual
								? '&= ' + expStr
								: expStr
							: i === 1
								? ` &= ${expStr}`
								: `\n\t\\\\ &= ${expStr}`;
				} else {
					str +=
						i === 0
							? this.leadingEqual
								? `&= ${expStr}`
								: `& ${expStr}`
							: `\n\t\\\\ &= ${expStr}`;
				}
			}
		}
		return str;
	}

	/**
	 * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 * */
	expand(options) {
		this.expression = this.expression.expand(options);
		return addStep(this, options);
	}

	/**
	 * @param {Shorthand} expression
	 * @return {ExpressionWorking}
	 */
	addCustomStep(expression) {
		if (typeof expression === 'string') {
			this.expressions.push(expression);
			return this;
		}
		this.expression = shorthandToExpression(expression);
		return addStep(this);
	}
}

/**
 * @param {ExpressionWorking} working
 * @param {WorkingOptions} [options]
 * @returns {ExpressionWorking}
 */
function addStep(working, options) {
	const prev = working.expressions[working.expressions.length - 1];
	const exp = working.expression;
	if (!options?.hide && `${prev}` !== `${exp}`) {
		if (options?.string) {
			working.expressions.push(exp.toString());
		} else {
			working.expressions.push(exp);
		}
	}
	return working;
}
