/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
import {
	Expression,
	shorthandToExpression,
} from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';

/**
 * Absolute function Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Abs extends Fn {
	functionName = 'absolute';
	/**
	 * Creates an absolute term
	 * @param {Shorthand} expression
	 */
	constructor(expression) {
		super(shorthandToExpression(expression));
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\left\\lvert ${this.argument.toString()} \\right\\rvert`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `|${this.argument._to_lexical_string()}|`;
	}

	/**
	 * @returns {Abs}
	 */
	clone() {
		return new Abs(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Abs}
	 */
	subIn(scope, options) {
		return new Abs(this.argument.subIn(scope, options));
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {ExpressionNode}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		const arg = this.argument.simplify(options).node;
		if (arg.type === 'numeral') {
			return arg.abs();
		}
		return new Abs(arg);
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.abs(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.abs(this.argument.valueOf());
	}
}

/**
 * @param {Shorthand} exp
 * @returns {Expression}
 */
export function absTerm(exp) {
	return new Expression(new Abs(exp));
}
