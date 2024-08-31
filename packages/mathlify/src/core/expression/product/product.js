import { Numeral } from '../numeral/numeral.js';

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
	/** @type {'product'} */
	type = 'product';
	/** @type {Numeral} */
	coeff;
	/**@type {Expression[]} */
	factors;
	/**
	 * Creates a Product
	 * @param {[number|Numeral|Expression, ...Expression[]]|Expression[]} factors
	 */
	constructor(...factors) {
		const first_term = factors[0];
		if (typeof first_term === 'number') {
			this.coeff = new Numeral(first_term);
			this.factors = /** @type {Expression[]} */ (factors.slice(1));
		} else if (first_term.type === 'numeral') {
			this.coeff = first_term;
			this.factors = /** @type {Expression[]} */ (factors.slice(1));
		} else if (first_term.node.type === 'numeral') {
			this.coeff = first_term.node;
			this.factors = /** @type {Expression[]} */ (factors.slice(1));
		} else {
			this.coeff = new Numeral(1);
			this.factors = /** @type {Expression[]} **/ (factors);
		}
	}

	/**
	 * @param {{multiplicationSign?: string}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		const { multiplicationSign } = {
			multiplicationSign: '',
			...options,
		};
		if (this.factors.length === 0) return this.coeff.toString();
		let str = this.coeff.is.one()
			? ''
			: this.coeff.is.negative_one()
				? '- '
				: `${this.coeff.toString()}`;
		if (multiplicationSign && this.coeff.is.negative_one()) {
			str = '- 1';
		}
		for (let factor of this.factors) {
			const times = str === '' ? '' : multiplicationSign;
			if (
				factor.node.type === 'numeral' ||
				(factor.node.type === 'product' &&
					!this.coeff.is.one() &&
					((this.coeff.is.negative_one() && factor.node.coeff.is.negative()) ||
						(!this.coeff.abs().is.one() &&
							factor.node.coeff.abs().is.one()))) ||
				((!this.coeff.is.one() || this.factors.length > 1) &&
					((factor.node.type === 'exponent' &&
						factor.node.base.node.type === 'numeral') ||
						factor.node.type === 'sum')) ||
				(!this.coeff.abs().is.one() && factor.node.type === 'quotient')
			) {
				// these should have brackets
				// case 1: factor is numeral -(-3), 2(3)
				// case 2: factor is product: -(-3x) or 2(3x)
				// case 3a: factor is num^f(x), other terms around (coeff not 1, other factors)
				// case 3b: factor is sum, and other terms around (coeff not 1, other factors)
				// case 3c: factor is quotient, other terms around (coeff not 1, other factors)
				str += `${times}\\left( ${factor.toString()} \\right)`;
			} else {
				str += `${times}${factor.toString()}`;
			}
		}
		return str;
	}
	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		for (const factor of this.factors) {
			if (factor.contains(variable)) return true;
		}
		return false;
	}

	/**
	 * @param {{coeff?: boolean}} [options] - whether to include coefficient. default: true
	 * @returns {string}
	 */
	_to_lexical_string(options) {
		const { coeff } = { coeff: true, ...options };
		const str = coeff ? this.coeff._to_lexical_string() : '';
		return (
			str +
			this.factors
				.map((factor) => factor._to_lexical_string())
				.toSorted()
				.join('*')
		);
	}

	///**
	// * @returns {Expression} new expression with coefficient set to 1. Simplified by default
	// */
	//toUnit() {
	//	const factors = this.factors.map((factor) => factor.clone());
	//	if (factors.length === 0)
	//		throw new Error('Cannot convert empty product to unit');
	//	const dummy = /** @type {Expression} */ (factors[0]).clone();
	//	dummy.node = new Product(...factors);
	//	dummy.node.coeff = new Numeral(1);
	//	return dummy;
	//}

	/**
	 * @returns {Product}
	 */
	clone() {
		if (this.factors.length === 0) {
			return new Product(this.coeff.clone());
		}
		const factors = this.factors.map((factor) => factor.clone());
		return new Product(this.coeff.clone(), ...factors);
	}

	//* boolean methods
	is = {
		/**
		 * checks if coefficient is negative
		 * @return {boolean}
		 * */
		negative: () => this.coeff.number.is.negative(),
		/** @returns {boolean} */
		variable: () => {
			return this.factors.some((factor) => factor.is.variable());
		},
	};

	// * arithmetic methods

	/** @returns {Product} */
	negative() {
		const result = this.clone();
		result.coeff = result.coeff.negative();
		return result;
	}
	/** @returns {Product} */
	abs() {
		const result = this.clone();
		result.coeff = result.coeff.abs();
		return result;
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Product}
	 */
	simplify(options) {
		return new Product(
			this.coeff.simplify(options),
			...this.factors.map((f) => f.simplify(options)),
		)._flatten();
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options
	 * @returns {Product}
	 */
	subIn(scope, options) {
		const factors = this.factors.map((factor) => factor.subIn(scope, options));
		return new Product(this.coeff.clone(), ...factors);
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return this.factors.reduce(
			(acc, factor) => acc * factor.fn(x, variable),
			this.coeff.valueOf(),
		);
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.factors.reduce(
			(acc, factor) => acc * factor.valueOf(),
			this.coeff.valueOf(),
		);
	}

	/**
	 * flattens product (no product within products)
	 * @returns {this}
	 * ! Warning: mutates current instance
	 */
	_flatten() {
		let coeff = this.coeff;
		/** @type {Expression[]} */
		let factors = [];
		for (const factor of this.factors) {
			const node = factor.node;
			if (node.type === 'sum') {
				node._flatten();
				factors.push(factor);
			} else if (node.type === 'product') {
				const newFactor = node._flatten();
				coeff = coeff.times(newFactor.coeff);
				factors = factors.concat(newFactor.factors);
			} else {
				factors.push(factor);
			}
		}
		this.coeff = coeff;
		this.factors = factors;
		return this;
	}
}
