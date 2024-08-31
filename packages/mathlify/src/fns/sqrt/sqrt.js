/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
import { Fn } from '../../core/expression/fn/custom-function.js';
import {
	Expression,
	Numeral,
	Product,
	Sum,
	shorthandToExpression,
} from '../../core/expression/expression.js';

/**
 * Sqrt Class
 * */
export class Sqrt extends Fn {
	functionName = 'sqrt';
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
		return `\\sqrt{${this.argument.toString()}}`;
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return `\\sqrt{${this.argument._to_lexical_string()}}`;
	}

	/**
	 * @returns {Sqrt}
	 */
	clone() {
		return new Sqrt(this.argument.clone());
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options - default to automatic simplification
	 * @returns {Sqrt}
	 */
	subIn(scope, options) {
		return new Sqrt(this.argument.subIn(scope, options));
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable) => {
		return Math.sqrt(this.argument.fn(x, variable));
	};

	/**
	 * @returns {number}
	 */
	valueOf() {
		return Math.sqrt(this.argument.valueOf());
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Sqrt|Product|Numeral}
	 */
	simplify(options) {
		if (options?.verbatim) return this;
		const arg = this.argument.simplify(options);
		// TODO: simplify sqrt(4x) to 2sqrt(x)
		if (arg.node.type === 'numeral') {
			const n = arg.node.clone().simplify();
			if (n.is.zero() || n.is.one()) return n;
			if (n.is.negative())
				throw new Error('Cannot take the square root of a negative number');
			const num = n.number.num.valueOf();
			const den = n.number.den.valueOf();
			const [coeffNum, radicandNum] = makeSquareFree(num);
			const [coeffDen, radicandDen] = makeSquareFree(den);
			const radicand = new Numeral([radicandNum, radicandDen]);
			if (n.is.equalTo(radicand)) return new Sqrt(arg);
			const coeff = new Numeral([coeffNum, coeffDen]);
			return radicand.is.one()
				? coeff
				: new Product(
						new Expression(coeff),
						new Expression(new Sqrt(radicand)),
					);
		}
		return new Sqrt(arg);
	}
}

/**
 * Creates a expression of the form a*sqrt{b}
 * @param {Shorthand} radicand
 * @param {{coeff?: number|Numeral|Expression} & SimplifyOptions} [options]
 * @returns {Expression}
 */
export function sqrtTerm(radicand, options) {
	return options?.coeff
		? new Expression([options.coeff, new Sqrt(radicand)]).simplify(options)
		: new Expression(new Sqrt(radicand)).simplify(options);
}

/**
 * Extract squares from n such that sqrt(n) = a * sqrt(b), where b is square free
 * Works up to primes less than 100 at the moment
 * @param {number} n
 * @param {number} [a=1] coefficient of the surd term
 * @returns {[number, number]} a,b such that sqrt(n) = a * sqrt(b)
 */
function makeSquareFree(n, a = 1) {
	if (n === 0) {
		return [0, 1];
	}
	const primes = [
		2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
		73, 79, 83, 89, 97,
	];
	for (const prime of primes) {
		if (n % (prime * prime) === 0) {
			return makeSquareFree(n / (prime * prime), a * prime);
		} else if (n < prime * prime) {
			break;
		}
	}
	return [a, n];
}

/**
 * Simplifies
 * - sqrt{a} sqrt{b} into sqrt{a*b}
 * - sqrt{a}^2 into a
 * @param {Expression} expression
 * @returns {Expression}
 */
export function simplifySurd(expression) {
	if (expression.node.type === 'product') {
		/** @type {Expression[]} */
		const others = [];
		/** @type {Expression[]} */
		const radicands = [];
		for (const factor of expression.node.factors) {
			if (factor.node.type === 'fn' && factor.node instanceof Sqrt) {
				radicands.push(factor.node.argument);
			} else {
				others.push(factor.clone());
			}
		}
		if (radicands.length <= 1) return expression;
		const radicand = new Expression(new Product(...radicands)).simplify();
		const radical = new Expression(new Sqrt(radicand)).simplify();
		return new Expression(
			new Product(new Expression(expression.node.coeff), ...others, radical),
		).simplify();
	} else if (
		expression.node.type === 'exponent' &&
		expression.node.base.node.type === 'fn' &&
		expression.node.base.node instanceof Sqrt &&
		expression.node.power.node.type === 'numeral' &&
		expression.node.power.node.is.equalTo(2)
	) {
		return expression.node.base.node.argument.simplify();
	} else if (
		expression.node.type === 'exponent' &&
		expression.node.base.node.type === 'numeral' &&
		expression.node.power.node.type === 'numeral' &&
		expression.node.power.node.number.den === 2
	) {
		const radicand = expression.node.base.node.pow(
			expression.node.power.node.number.num,
		);
		return new Expression(new Sqrt(radicand)).simplify();
	}
	return expression;
}

/**
 * Given an expression a + k sqrt{b}, returns a - k sqrt{b}
 * @param {Expression} expression
 */
export function surdConjugate(expression) {
	if (expression.node.type !== 'sum')
		throw new Error(
			`Expected a sum expression. ${expression.toString()} received.`,
		);
	if (expression.node.terms.length !== 2)
		throw new Error(
			`Expected a sum of two terms. ${expression.toString()} received.`,
		);
	const [t1, t2] = /** @type {[Expression, Expression]} */ (
		expression.node.terms
	);
	if (isRadicalForm(t2)) {
		return new Sum(
			t1.clone(),
			new Expression(new Product(new Expression(-1), t2.clone())).simplify(),
		);
	}
	throw new Error(
		`Expected a radical form for second term. ${t2.toString()} received in ${expression.toString()}`,
	);
}

/**
 * checks if an expression is of the form k sqrt{b}
 * @param {Expression} expression
 * @returns {boolean}
 */
function isRadicalForm(expression) {
	if (expression.node.type === 'fn' && expression.node.functionName === 'sqrt')
		return true;
	if (expression.node.type !== 'product') return false;
	const coeff = expression.node.coeff;
	const factors = expression.node.factors;
	if (factors.length === 1)
		return isRadicalForm(/** @type {Expression} */ (factors[0]));
	if (factors.length === 2) {
		if (!coeff.is.one())
			return (
				isRadicalForm(/** @type {Expression} */ (factors[0])) !==
				isRadicalForm(/** @type {Expression} */ (factors[1]))
			);
	}
	return false;
}
