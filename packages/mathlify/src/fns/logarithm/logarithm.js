/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */

import { Fn } from '../../core/expression/fn/custom-function.js';
import {
	Expression,
	Numeral,
	shorthandToExpression,
} from '../../core/expression/expression.js';

/**
 * Logarithm Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Logarithm extends Fn {
	functionName = 'logarithm';
	// TODO: add support for other bases
	/**
	 * Creates a Sqrt term
	 * @param {Shorthand} expression
	 */
	constructor(expression) {
		super(shorthandToExpression(expression));
	}

	/**
	 * @returns {string}
	 */
	toString() {
		const node = this.argument.node;
		const arg =
			node.type === 'sum' ? `\\left( ${node.toString()} \\right)` : node;
		return `\\ln ${arg.toString()}`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `\\ln (${this.argument._to_lexical_string()})`;
	}

	/**
	 * @returns {Logarithm}
	 */
	clone() {
		return new Logarithm(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Logarithm}
	 */
	subIn(scope, options) {
		return new Logarithm(this.argument.subIn(scope, options));
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.log(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.log(this.argument.valueOf());
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Logarithm|Numeral}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		// TODO: simplify sqrt(4x) to 2sqrt(x)
		if (this.argument.node.type === 'numeral' && this.argument.node.is.one()) {
			return new Numeral(0);
		} else if (
			this.argument.node.type === 'variable' &&
			this.argument.node.name === 'e'
		) {
			//TODO: special e class to typeset as roman
			return new Numeral(1);
		}
		return new Logarithm(this.argument.simplify(options));
	}
}

/**
 * Creates a expression of the form a*sqrt{b}
 * @param {Shorthand} arg
 * @param {{coeff?: number|Numeral} & SimplifyOptions} [options]
 * @returns
 */
export function logTerm(arg, options) {
	return options?.coeff
		? new Expression([options.coeff, new Logarithm(arg)]).simplify(options)
		: new Expression(new Logarithm(arg)).simplify(options);
}

// TODO: simplify logs custom simplifier
