/**
 * implementation of the bisection method for numerical root finding.
 *
 * @param {(x:number)=>number} f function
 * @param {number} lower lower bound (sign must be different at lower and upper)
 * @param {number} upper upper bound (sign must be different at lower and upper)
 * @param {number} [precision=5] number of digits after the decimal point to match before terminating
 */
export function bisection(f, lower, upper, precision = 5) {
	if (Math.abs(upper - lower) < Math.pow(10, -precision)) {
		return (upper + lower) / 2;
	} else {
		const fa = f(lower);
		const fb = f(upper);
		if (Math.sign(fa) === Math.sign(fb)) {
			throw new Error('bisection ERROR: no sign change detected');
		}
		const midPt = (lower + upper) / 2;
		if (Math.sign(fa) === Math.sign(f(midPt))) {
			return bisection(f, midPt, upper, precision);
		} else {
			return bisection(f, lower, midPt, precision);
		}
	}
}
