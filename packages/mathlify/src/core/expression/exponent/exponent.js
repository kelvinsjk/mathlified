/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').Variable} Variable */

/**
 * The `Exponent` class represents a base raised to a power
 * @property {'exponent'} type
 * @property {Expression} base
 * @property {Expression} power
 * */
export class Exponent {
	/** @type {'exponent'} */
	type = 'exponent';
	/**@type {Expression} */
	base;
	/**@type {Expression} */
	power;
	/**
	 * Creates a Quotient
	 * @param {Expression} base
	 * @param {Expression} power
	 */
	constructor(base, power) {
		this.base = base;
		this.power = power;
	}

	/**
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.base.contains(variable) || this.power.contains(variable);
	}

	is = {
		/** @returns {boolean} */
		variable: () => {
			return this.base.is.variable() || this.power.is.variable();
		},
	};

	/** @returns {string} */
	toString() {
		return `${handleBaseString(this.base)}^${handlePowerString(this.power.toString())}`;
	}

	/** @returns {string} */
	_to_lexical_string() {
		return `(${this.base._to_lexical_string()})^(${this.power._to_lexical_string()})`;
	}

	/** @returns {Exponent} */
	clone() {
		return new Exponent(this.base.clone(), this.power.clone());
	}

	/**
	 * @param {import('../expression.js').SimplifyOptions} [options]
	 * @returns {Exponent}
	 */
	simplify(options) {
		return new Exponent(
			this.base.simplify(options),
			this.power.simplify(options),
		);
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options
	 * @returns {Exponent}
	 */
	subIn(scope, options) {
		return new Exponent(
			this.base.subIn(scope, options),
			this.power.subIn(scope, options),
		);
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.pow(this.base.fn(x, variable), this.power.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.pow(this.base.valueOf(), this.power.valueOf());
	}
}

/**
 * @param {string} powerStr
 * @returns {string}
 */
function handlePowerString(powerStr) {
	if (powerStr.length > 1) {
		powerStr = `{${powerStr}}`;
	}
	return powerStr;
}
/**
 * @param {Expression} base
 * @param {string} [baseString]
 * @returns {string}
 */
function handleBaseString(base, baseString) {
	let baseStr = baseString || base.toString();
	if (
		base.node.type === 'sum' ||
		base.is.negative() ||
		base.node.type === 'quotient'
	) {
		baseStr = `\\left( ${baseStr} \\right)`;
	}
	return baseStr;
}
