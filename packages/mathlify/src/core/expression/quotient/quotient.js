/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').Variable} Variable */

/**
 * The `Quotient` class represents a fraction of two expressions
 * @property {'quotient'} type
 * @property {Expression} num - the numerator
 * @property {Expression} den - the denominator
 * */
export class Quotient {
	/** @type {'quotient'} */
	type = 'quotient';
	/**@type {Expression} */
	num;
	/**@type {Expression} */
	den;
	/**
	 * Creates a Quotient
	 * @param {Expression} num
	 * @param {Expression} den
	 */
	constructor(num, den) {
		this.num = num;
		this.den = den;
	}

	reciprocal() {
		return new Quotient(this.den.clone(), this.num.clone());
	}

	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.num.contains(variable) || this.den.contains(variable);
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\frac{${this.num.toString()}}{${this.den.toString()}}`;
	}

	/** @returns {string} */
	_to_lexical_string() {
		return `(${this.num._to_lexical_string()})/(${this.den._to_lexical_string()})`;
	}

	/**
	 * @returns {Quotient}
	 */
	clone() {
		return new Quotient(this.num.clone(), this.den.clone());
	}

	/**
	 * @param {import('../expression.js').SimplifyOptions} [options]
	 * @returns {Quotient}
	 */
	simplify(options) {
		if (options?.verbatim === true) return this.clone();
		if (this.den.node.type === 'numeral' && !this.den.node.is.integer()) {
			const multiple = this.den.node.number.den;
			return new Quotient(
				this.num.times(multiple, { expand: true }).simplify(),
				this.den.times(multiple).simplify(),
			);
		} else if (
			this.num.node.type === 'quotient' &&
			!(options?.verbatim === 'quotient')
		) {
			if (this.den.node.type === 'quotient') {
				// (a/b)/(c/d) = (a*d)/(b*c)
				return new Quotient(
					this.num.node.num.times(this.den.node.den).simplify(options),
					this.num.node.den.times(this.den.node.num).simplify(options),
				);
			}
			if (this.den.node.type !== 'sum') {
				// (a/b)/c = a/(b*c)
				const num = this.num.node;
				return new Quotient(
					num.num.clone(),
					this.den.times(num.den).simplify(options),
				);
			}
		} else if (
			this.den.node.type === 'quotient' &&
			!(options?.verbatim === 'quotient') &&
			this.num.node.type !== 'sum'
		) {
			// a/(b/c) = (a*c)/b
			return new Quotient(
				this.num.times(this.den.node.den).simplify(options),
				this.den.node.num.clone(),
			);
		}
		return new Quotient(this.num.simplify(options), this.den.simplify(options));
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options
	 * @returns {Quotient}
	 */
	subIn(scope, options) {
		return new Quotient(
			this.num.subIn(scope, options),
			this.den.subIn(scope, options),
		);
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return this.num.fn(x, variable) / this.den.fn(x, variable);
	};

	is = {
		/** @returns {boolean} */
		variable: () => this.num.is.variable() || this.den.is.variable(),
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.num.valueOf() / this.den.valueOf();
	}
}
