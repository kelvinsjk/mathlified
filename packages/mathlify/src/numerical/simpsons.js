/**
 * implementation of Simpson's 1/3 rule for numerical integration.
 *
 * @param {(x:number)=>number} f function to integrate
 * @param {number} lower lower bound of the integral
 * @param {number} upper upper bound of the integral
 * @param {number} [intervals=100] number of intervals (defaults to 100)
 * @returns {number} the numerical integral of f
 */
export function simpsons(f, lower, upper, intervals = 100) {
	let result = 0;
	const stepSize = (upper - lower) / intervals;
	/** @type {number} */
	let i;
	for (i = 0; i < intervals; i++) {
		result += simpson_step(f, lower + i * stepSize, lower + (i + 1) * stepSize);
	}
	return result;
}

/**
 *
 * @param {function(number): number} f function to integrate
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const simpson_step = (f, a, b) =>
	((b - a) / 8) *
	(f(a) + 3 * f((2 * a + b) / 3) + 3 * f((a + 2 * b) / 3) + f(b));
