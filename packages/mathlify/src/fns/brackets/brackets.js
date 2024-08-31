/** @typedef {import('../../index.js').Expression} Expression */
/** @typedef {import('../../index.js').Variable} Variable */
/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
import { shorthandToExpression } from '../../core/expression/expression.js';
import { Fn } from '../../core/expression/fn/custom-function.js';

/**
 * Brackets Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Brackets extends Fn {
	functionName = 'brackets';
	/**
	 * Creates a Bracketed term
	 * @param {Shorthand} expression
	 */
	constructor(expression) {
		super(shorthandToExpression(expression));
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\left( ${this.argument.toString()} \\right)`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `(${this.argument._to_lexical_string()})`;
	}

	/**
	 * @returns {Brackets}
	 */
	clone() {
		return new Brackets(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Brackets}
	 */
	subIn(scope, options) {
		return new Brackets(this.argument.subIn(scope, options));
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {ExpressionNode}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		return this.argument.simplify(options).node;
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return this.argument.fn(x, variable);
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.argument.valueOf();
	}
}
