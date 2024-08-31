/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
import { Fn } from '../../core/expression/fn/custom-function.js';
import {
	Expression,
	Numeral,
	Product,
	Quotient,
	pi,
	//Quotient,
	shorthandToExpression,
} from '../../core/expression/expression.js';
import { arrayHasLengthEqualTo } from '../../utils/typescript/array-length.js';
import { sqrtTerm, Sqrt } from '../sqrt/sqrt.js';

/**
 * Sine Class
 * */
export class Sin extends Fn {
	/** @type {'sin'} */
	functionName = 'sin';
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
		const bracketedArg =
			this.argument.node.type === 'sum'
				? `(${this.argument.toString()})`
				: this.argument.toString();
		return `\\sin ${bracketedArg}`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `\\sin(${this.argument._to_lexical_string()})`;
	}

	/**
	 * @returns {Sin}
	 */
	clone() {
		return new Sin(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Sin}
	 */
	subIn(scope, options) {
		return new Sin(this.argument.subIn(scope, options));
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.sin(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.sin(this.argument.valueOf());
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Sin|Numeral|Product|Quotient}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		const arg = this.argument.simplify(options);
		const isSpecial = isSpecialAngle(arg);
		if (!isSpecial) return new Sin(arg);
		let [_, angle] = isSpecial;
		// Normalize angle
		while (angle.is.negative() || angle.is.atLeast(2)) {
			angle = angle.is.negative() ? angle.plus(2) : angle.minus(2);
		}
		const half = new Numeral([1, 2]);
		if (angle.is.atMost(1)) {
			const acuteAngle = angle.is.atMost(half)
				? angle
				: angle.negative().plus(1);
			const result = sinAcute(acuteAngle);
			if (result) return result;
		} else {
			const acuteAngle = angle.is.atMost(half.plus(1))
				? angle.minus(1)
				: angle.negative().plus(2);
			const result = sinAcute(acuteAngle);
			if (result) {
				return result.type === 'numeral'
					? result.negative()
					: new Product(-1, new Expression(result));
			}
		}
		return new Sin(arg);
	}

	/**
	 * @param {Shorthand} ratio
	 * @returns {Expression}
	 */
	static inverse(ratio) {
		// TODO: negative values and surds
		const exp = shorthandToExpression(ratio).simplify();
		if (exp.node.type === 'numeral') {
			const num = exp.node;
			if (num.is.equalTo(0)) {
				return new Expression(0);
			} else if (num.is.equalTo(new Numeral([1, 2]))) {
				return new Expression([pi, '/', 6]);
			} else if (num.is.equalTo(1)) {
				return new Expression([pi, '/', 2]);
			}
		}
		throw new Error(
			`sin inverse of the provided value ${ratio.toString()} is not supported yet.`,
		);
	}
}

/**
 * Cosine Class
 * */
export class Cos extends Fn {
	/** @type {'cos'} */
	functionName = 'cos';
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
		const bracketedArg =
			this.argument.node.type === 'sum'
				? `(${this.argument.toString()})`
				: this.argument.toString();
		return `\\cos ${bracketedArg}`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `\\cos(${this.argument._to_lexical_string()})`;
	}

	/**
	 * @returns {Cos}
	 */
	clone() {
		return new Cos(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Cos}
	 */
	subIn(scope, options) {
		return new Cos(this.argument.subIn(scope, options));
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.cos(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.cos(this.argument.valueOf());
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Cos|Numeral|Quotient|Product} //{Sin|Quotient|Numeral}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		const arg = this.argument.simplify(options);
		const isSpecial = isSpecialAngle(arg);
		if (!isSpecial) return new Cos(arg);
		let [_, angle] = isSpecial;
		// Normalize angle
		while (angle.is.negative() || angle.is.atLeast(2)) {
			angle = angle.is.negative() ? angle.plus(2) : angle.minus(2);
		}
		const half = new Numeral([1, 2]);
		if (angle.is.atMost(half) || angle.is.atLeast(half.plus(1))) {
			const acuteAngle = angle.is.atMost(half)
				? angle
				: angle.negative().plus(2);
			const result = cosAcute(acuteAngle);
			if (result) return result;
		} else {
			const acuteAngle = angle.is.atMost(1)
				? angle.negative().plus(1)
				: angle.minus(1);
			const result = cosAcute(acuteAngle);
			if (result) {
				return result.type === 'numeral'
					? result.negative()
					: new Product(-1, new Expression(result));
			}
		}
		return new Cos(arg);
	}

	/**
	 * @param {Shorthand} ratio
	 * @returns {Expression}
	 */
	static inverse(ratio) {
		// TODO: negative values and surds
		const exp = shorthandToExpression(ratio).simplify();
		if (exp.node.type === 'numeral') {
			const num = exp.node;
			if (num.is.equalTo(0)) {
				return new Expression([pi, '/', 2]);
			} else if (num.is.equalTo(new Numeral([1, 2]))) {
				return new Expression([pi, '/', 3]);
			} else if (num.is.equalTo(1)) {
				return new Expression(0);
			}
		}
		throw new Error(
			`cos inverse of the provided value ${ratio.toString()} is not supported yet.`,
		);
	}
}

/**
 * Tangent Class
 * */
export class Tan extends Fn {
	/** @type {'tan'} */
	functionName = 'tan';
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
		const bracketedArg =
			this.argument.node.type === 'sum'
				? `(${this.argument.toString()})`
				: this.argument.toString();
		return `\\tan ${bracketedArg}`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `\\tan(${this.argument._to_lexical_string()})`;
	}

	/**
	 * @returns {Tan}
	 */
	clone() {
		return new Tan(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Tan}
	 */
	subIn(scope, options) {
		return new Tan(this.argument.subIn(scope, options));
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.tan(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.tan(this.argument.valueOf());
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Tan|Numeral|Quotient|Product|Sqrt} //{Sin|Quotient|Numeral}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		const arg = this.argument.simplify(options);
		const isSpecial = isSpecialAngle(arg);
		if (!isSpecial) return new Tan(arg);
		let [_, angle] = isSpecial;
		// Normalize angle
		while (angle.is.negative() || angle.is.atLeast(2)) {
			angle = angle.is.negative() ? angle.plus(2) : angle.minus(2);
		}
		const half = new Numeral([1, 2]);
		if (
			angle.is.atMost(half) ||
			(angle.is.atLeast(1) && angle.is.atMost(half.plus(1)))
		) {
			const acuteAngle = angle.is.atMost(half) ? angle : angle.minus(1);
			const result = tanAcute(acuteAngle);
			if (result) return result;
		} else {
			const acuteAngle = angle.is.atMost(1)
				? angle.negative().plus(1)
				: angle.negative().plus(2);
			const result = tanAcute(acuteAngle);
			if (result) {
				return result.type === 'numeral'
					? result.negative()
					: new Product(-1, new Expression(result));
			}
		}
		return new Tan(arg);
	}

	/**
	 * @param {Shorthand} ratio
	 * @returns {Expression}
	 */
	static inverse(ratio) {
		// TODO: negative values
		const exp = shorthandToExpression(ratio).simplify();
		if (exp.node.type === 'numeral') {
			const num = exp.node;
			if (num.is.equalTo(0)) {
				return new Expression(0);
			} else if (num.is.equalTo(1)) {
				return new Expression([pi, '/', 4]);
			}
		} else if (exp.node.type === 'fn') {
			if (exp.toString() === '\\sqrt{3}') return new Expression([pi, '/', 3]);
		} else if (exp.node.type === 'quotient') {
			if (exp.toString() === '\\frac{\\sqrt{3}}{3}')
				return new Expression([pi, '/', 6]);
		}
		throw new Error(
			`tan inverse of the provided value ${ratio.toString()} is not supported yet.`,
		);
	}
}

/**
 * @param {Numeral} angle
 * @returns {Numeral|Quotient|undefined}
 */
function cosAcute(angle) {
	switch (angle.toString()) {
		case '0':
			return new Numeral(1);
		case '\\frac{1}{6}':
			return new Quotient(sqrtTerm(3), new Expression(2));
		case '\\frac{1}{4}':
			return new Quotient(sqrtTerm(2), new Expression(2));
		case '\\frac{1}{3}':
			return new Numeral([1, 2]);
		case '\\frac{1}{2}':
			return new Numeral(0);
		default:
			return undefined;
	}
}
/**
 * @param {Numeral} angle
 * @returns {Numeral|Quotient|undefined}
 */
function sinAcute(angle) {
	switch (angle.toString()) {
		case '0':
			return new Numeral(0);
		case '\\frac{1}{6}':
			return new Numeral([1, 2]);
		case '\\frac{1}{4}':
			return new Quotient(sqrtTerm(2), new Expression(2));
		case '\\frac{1}{3}':
			return new Quotient(sqrtTerm(3), new Expression(2));
		case '\\frac{1}{2}':
			return new Numeral(1);
		default:
			return undefined;
	}
}
/**
 * @param {Numeral} angle
 * @returns {Numeral|Quotient|Sqrt|undefined}
 */
function tanAcute(angle) {
	switch (angle.toString()) {
		case '0':
			return new Numeral(0);
		case '\\frac{1}{6}':
			return new Quotient(sqrtTerm(3), new Expression(3));
		case '\\frac{1}{4}':
			return new Numeral(1);
		case '\\frac{1}{3}':
			return new Sqrt(3);
		case '\\frac{1}{2}':
			throw new Error('tan(pi/2) is undefined');
		default:
			return undefined;
	}
}

/**
 * Creates a expression of the form a*sqrt{b}
 * @param {'sin'|'cos'} trigFn
 * @param {Shorthand} arg
 * @param {{coeff?: number|Numeral|Expression}} [options]
 * @returns {Expression}
 */
export function trigTerm(trigFn, arg, options) {
	const constructor = trigFn === 'sin' ? Sin : Cos;
	return options?.coeff
		? new Expression([options.coeff, new constructor(arg)])
		: new Expression(new constructor(arg));
}

/**
 * @param {Expression} angle
 * @returns {false|[true, Numeral]}
 */
function isSpecialAngle(angle) {
	if (angle.node.type === 'product') {
		const [coeff, factors] = [angle.node.coeff, angle.node.factors];
		if (!arrayHasLengthEqualTo(factors, 1)) return false;
		if (coeff.is.negative_one()) {
			const isSpecial = isSpecialAngle(factors[0]);
			if (isSpecial) {
				isSpecial[1] = isSpecial[1].negative();
			}
			return isSpecial;
		}
		if (factors[0].node.type === 'variable' && factors[0].node.name === 'pi') {
			const den = coeff.number.den;
			if (den === 6 || den === 4 || den === 3 || den === 2 || den === 1) {
				return [true, coeff.clone()];
			}
		}
	} else if (angle.node.type === 'quotient') {
		const [num, den] = [angle.node.num, angle.node.den];
		if (
			(num.node.type === 'variable' && num.node.name === 'pi') ||
			(num.node.type === 'product' &&
				arrayHasLengthEqualTo(num.node.factors, 1) &&
				num.node.factors[0].node.type === 'variable' &&
				num.node.factors[0].node.name === 'pi')
		) {
			const k = num.node.type === 'variable' ? 1 : num.node.coeff.valueOf();
			if (den.node.type === 'numeral' && Number.isInteger(k)) {
				const denVal = den.node.valueOf();
				if (
					denVal === 6 ||
					denVal === 4 ||
					denVal === 3 ||
					denVal === 2 ||
					denVal === 1
				) {
					return [true, new Numeral([k, denVal])];
				}
			}
		}
	} else if (angle.node.type === 'variable' && angle.node.name === 'pi') {
		return [true, new Numeral(1)];
	} else if (angle.node.type === 'numeral' && angle.node.is.zero()) {
		return [true, new Numeral(0)];
	}
	return false;
}
