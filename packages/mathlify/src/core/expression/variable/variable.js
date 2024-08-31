/**
 * The `Variable` class represents a mathematical symbol
 * @property {'variable'} type
 * @property {string} name - the string representation of the variable
 * */
export class Variable {
	/** @type {'variable'} */
	type = 'variable';
	/** @type {number|undefined} */
	constantValue;
	/** @type {string|undefined} */
	typesetString;
	/**
	 * @constructor
	 * Creates a Variable
	 * @param {string} name - the string representation of the variable
	 * @param {{constantValue?: number, typesetString?: string}} [options] - options to identify as a constant value or to set a custom typeset string
	 */
	constructor(name, options) {
		this.name = name;
		this.constantValue = options?.constantValue;
		this.typesetString = options?.typesetString;
	}

	simplify() {
		return this;
	}

	/**
	 * @returns {string} `this.name`
	 */
	toString() {
		return this.typesetString ?? this.name;
	}

	/** @returns {string} */
	_to_lexical_string() {
		return this.name;
	}

	get options() {
		return {
			constantValue: this.constantValue,
			typesetString: this.typesetString,
		};
	}

	/**
	 * @returns {Variable}
	 */
	clone() {
		return new Variable(this.name, this.options);
	}

	is = {
		/** @returns {boolean} */
		variable: () => {
			return this.constantValue === undefined;
		},
	};

	/**
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.name === variable;
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		const variableName =
			variable instanceof Variable ? variable.name : variable;
		if (this.name === variableName) return x;
		return this.valueOf();
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		if (this.constantValue === undefined)
			throw new Error(`Variable ${this.name} has no value`);
		return this.constantValue;
	}
}
