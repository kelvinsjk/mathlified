/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../numeral/fraction/fraction.js').Fraction} Fraction */
/** @typedef {import('../variable/variable.js').Variable} Variable */

/**
 * The `Sum` class represents a sum as an array of terms
 * @property {Expression[]} _termsExp - the terms in the sum
 * */
export class Sum {
	/** @type {'sum'} */
	type = 'sum';
	/**@type {Expression[]} */
	terms;
	/**
	 * Creates a Sum
	 * @param {...Expression} terms
	 */
	constructor(...terms) {
		this.terms = terms;
	}

	/**
	 * @param {import('../expression.js').SimplifyOptions} [options]
	 * @returns {Sum} */
	negative(options) {
		return new Sum(...this.terms.map((term) => term.negative())).simplify(
			options,
		);
	}

	/**
	 * @returns {string}
	 */
	toString() {
		if (this.terms.length === 0) return '0';
		if (this.terms.length === 1)
			return /** @type {Expression} */ (this.terms[0]).toString();
		const firstTerm = /** @type {Expression} */ (this.terms[0]);
		let latexString = firstTerm.toString();
		for (const term of this.terms.slice(1)) {
			if (
				(term.node.type === 'numeral' && term.node.is.negative()) ||
				(term.node.type === 'product' && term.node.is.negative())
			) {
				// negative sign is already included
				latexString += ` ${term.toString()}`;
			} else {
				latexString += ` + ${term.toString()}`;
			}
		}
		return latexString;
	}

	/**
	 * @param {import('../expression.js').SimplifyOptions} [options]
	 * @returns {Sum}
	 */
	simplify(options) {
		if (options?.verbatim === true) return this;
		const terms = this.terms.map((term) => term.simplify(options));
		return new Sum(...terms)._flatten().#remove_zeroes();
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options
	 * @returns {Sum}
	 */
	subIn(scope, options) {
		const terms = this.terms.map((term) => term.subIn(scope, options));
		return new Sum(...terms);
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return this.terms.reduce((acc, term) => acc + term.fn(x, variable), 0);
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.terms.reduce((acc, term) => acc + term.valueOf(), 0);
	}

	is = {
		/** @returns {boolean} */
		variable: () => {
			return this.terms.some((term) => term.is.variable());
		},
	};

	/**
	 * rearranges the terms
	 * @param {number[]} order - index of term to be placed in order. eg [1, 0, 2] means the we new terms be the original 2nd, 1st, 3rd terms
	 * @returns {Sum}
	 * WARNING: we do not check if indices given are valid
	 */
	rearrange(order) {
		if (this.terms.length !== order.length)
			throw new Error('Invalid indices length');
		// @ts-expect-error - we rely on the user to ensure the indices are valid
		const terms = order.map((i) => this.terms[i].clone());
		return new Sum(...terms);
	}

	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		for (const term of this.terms) {
			if (term.contains(variable)) return true;
		}
		return false;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return this.terms
			.map((term) => term._to_lexical_string())
			.toSorted()
			.join('+');
	}

	/**
	 * @returns {Sum}
	 */
	clone() {
		const terms = this.terms.map((term) => term.clone());
		return new Sum(...terms);
	}

	/**
	 * removes zeroes from the sum
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	#remove_zeroes() {
		this.terms = this.terms.filter((term) => {
			const exp = term.node;
			if (exp.type === 'numeral') {
				return exp.number.is.nonzero();
			} else if (exp.type === 'product') {
				return exp.coeff.is.nonzero();
			}
			return true;
		});
		return this;
	}

	/**
	 * flattens sum
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	_flatten() {
		/** @type {Expression[]} */
		const terms = [];
		for (const term of this.terms) {
			if (term.node.type === 'sum') {
				term.node._flatten();
				terms.push(...term.node.terms);
			} else if (term.node.type === 'product') {
				term.node._flatten();
				terms.push(term);
			} else {
				terms.push(term);
			}
		}
		this.terms = terms;
		return this;
	}
}
