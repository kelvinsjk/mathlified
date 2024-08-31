import { Polynomial, Expression, Numeral } from '../index.js';
import { divisors } from '../utils/divisors.js';
import { expressionToPolynomial } from '../utils/expression-to-polynomial.js';
import { bisection } from './bisection.js';

/**
 * finds a rational root of a cubic if it exists,
 * or use the bisection method to find a numerical root
 * @param {Polynomial|[number,number,number,number]|Expression} cubic
 * @param {number} [lower=-10] lower bound to search for numerical root
 * @param {number} [upper=10] upper bound to search for numerical root
 * @param {number} [precision=5] number of digits after the decimal point to match before terminating
 * @returns {number|Expression}
 */
export function cubicRoot(cubic, lower, upper, precision) {
	const poly = Array.isArray(cubic)
		? new Polynomial(cubic)
		: cubic instanceof Polynomial
			? cubic
			: expressionToPolynomial(cubic);
	const rational = rationalRoot(poly);
	if (rational) return rational;
	return bisection(poly.fn, lower ?? -10, upper ?? 10, precision);
}

/**
 * finds a rational root of a cubic, if it exists.
 * otherwise returns undefined
 * @param {Polynomial} cubic
 * @returns {Expression|undefined}
 */
function rationalRoot(cubic) {
	let coeffs = cubic.coeffs.map((x) => new Expression(x)._getNumeral());
	const divisor = Numeral.gcd(...coeffs);
	const [d, _, __, a] = coeffs.map((x) => x.divide(divisor).valueOf());
	// consider factor Ax+B
	if (d === undefined || a === undefined)
		throw new Error('unexpected error in getting coefficients');
	if (d === 0) return new Expression(0);
	for (const A of divisors(a)) {
		for (const B of divisors(d)) {
			const x = new Numeral([B, A]);
			if (cubic.evaluate(x).is.zero()) return new Expression(x);
			const negX = x.negative();
			if (cubic.evaluate(negX).is.zero()) return new Expression(negX);
		}
	}
	return undefined;
}
