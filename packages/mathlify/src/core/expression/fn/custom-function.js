/** @typedef {import('../expression.js').Expression} Expression */
/** @typedef {import('../expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../expression.js').Shorthand} Shorthand */
/** @typedef {import('../expression.js').Variable} Variable */

/**
 * The `Fn` class is the base class for building custom functions. By default this behaves
 * as an identity function, but can be extended to create custom functions.
 * Important methods that should be modified if we desire non-identity behavior:
 * - `toString`
 * - `_to_lexical_string`
 * - `contains`
 * - `simplify`
 * - `clone`
 * - `subIn`
 * @property {Expression} argument
 */
export class Fn {
	/** @type {'fn'} */
	type = 'fn';
	/** @type {string} */
	functionName;
	/** @type {Expression} */
	argument;
	/**
	 * @constructor
	 * Creates a Fn
	 * @param {Expression} argument
	 * @param {{functionName?: string}} [options]
	 */
	constructor(argument, options) {
		// if (
		// 	typeof argument === 'string' ||
		// 	typeof argument === 'number' ||
		// 	Array.isArray(argument) ||
		// 	argument.type !== 'expression'
		// )
		// 	// TODO: remove this requirement?
		// 	throw new Error(
		// 		'This dummy identity function only accepts expressions as arguments',
		// 	);
		this.argument = argument;
		this.functionName = options?.functionName ?? 'f';
	}

	/**
	 * @returns {string}
	 */
	toString() {
		const knownFns = ['logarithm', 'sqrt', 'absolute', 'sin', 'cos', 'tan'];
		return this.argument.node.type === 'fn' &&
			!knownFns.includes(this.argument.node.functionName)
			? `${this.functionName}${this.argument.toString()}`
			: `${this.functionName}\\left(${this.argument.toString()}\\right)`;
	}

	/**
	 * Returns a custom string representation of the expression, using the provided function.
	 * If the function returns undefined, the default toString will be used
	 * @param {(exp:Expression)=>string|undefined} toStringFn
	 * @returns {string}
	 */
	toCustomString(toStringFn) {
		let argStr = toStringFn(this.argument);
		if (argStr === undefined) {
			return this.toString();
		}
		return argStr;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return this.functionName + this.argument._to_lexical_string();
	}

	/**
	 *
	 * @param {string} variable
	 * @returns {boolean}
	 */
	contains(variable) {
		return this.argument.contains(variable);
	}

	/**
	 * @param {SimplifyOptions} [_options]
	 * @returns {ExpressionNode}
	 */
	simplify(_options) {
		return new Fn(this.argument.simplify(), {
			functionName: this.functionName,
		});
	}

	/**
	 * @returns {Fn}
	 */
	clone() {
		return new Fn(this.argument.clone(), {
			functionName: this.functionName,
		});
	}

	/**
	 * @param {Record<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean|'quotient'}} options - default to automatic simplification
	 * @returns {ExpressionNode}
	 */
	subIn(scope, options) {
		const newArgument = this.argument.subIn(scope, options);
		const tryFunctionScope = scope[this.functionName];
		if (Object.keys(scope).length === 1 && tryFunctionScope !== undefined) {
			// replacing the function, assuming the argument is 'x'
			// TODO: support cases where argument is not x
			return tryFunctionScope.subIn({ x: newArgument }, options).node;
		}
		// sub into the argument
		return new Fn(newArgument, { functionName: this.functionName });
	}

	/**
	 * @param {number} _x
	 * @param {string|Variable} [_variable]
	 * @returns {number}
	 */
	fn = (_x, _variable) => {
		throw new Error(
			'fn to convert number to number not implemented for generic function',
		);
		//return this.argument.fn(x, variable);
	};

	is = {
		/** @returns {boolean} */
		variable: () => {
			return this.argument.is.variable();
		},
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		throw new Error(
			'fn to convert number to number not implemented for generic function',
		);
		//return this.argument.valueOf();
	}
}
