/**
 * finds greatest common divisor (gcd) of n integers,
 * of which at least one is non-zero
 * @param  {...number} integers
 * @returns {number} the (absolute) gcd of provided numbers
 */
export function gcd(...integers) {
	if (integers.length === 0) {
		throw new Error(`no arguments provided to gcd function`);
	}
	if (integers.length === 1) {
		const a = /** @type {number} */ (integers[0]);
		if (!Number.isInteger(a)) {
			throw new Error(`non-integer ${a} received in gcd function`);
		}
		if (a === 0) {
			throw new Error(`gcd(0) is undefined`);
		}
		return Math.abs(a);
	}
	// terminating condition
	if (integers.length === 2) {
		return gcdTwo(
			/** @type {number} */ (integers[0]),
			/** @type {number} */ (integers[1]),
		);
	}
	// recursively call this function
	const [int1, int2, ...rest] = /** @type {[number, number, ...number[]]} */ (
		integers
	);
	return int1 === 0 && int2 === 0
		? gcd(0, ...rest)
		: gcd(gcdTwo(int1, int2), ...rest);
}

// /**
//  * signed gcd: returns a negative gcd if
//  * at least one number is negative,
//  * and all numbers are non_positive
//  * @param  {...number} integers
//  * @returns {number}
//  */
// export function signed_gcd(...integers) {
// 	const abs_gcd = gcd(...integers);
// 	let has_negative = false;
// 	let non_positive = true;
// 	for (let int of integers) {
// 		if (!has_negative && int < 0) {
// 			has_negative = true;
// 		}
// 		if (int > 0) {
// 			non_positive = false;
// 			break;
// 		}
// 	}
// 	return has_negative && non_positive ? -abs_gcd : abs_gcd;
// }

/**
 * finds gcd of two numbers
 * @param {number} a - integer 1
 * @param {number} b - integer 2
 * @returns {number} (absolute) gcd
 */
function gcdTwo(a, b) {
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		throw new Error(`Non-integers (${a}, ${b}) received in gcd function`);
	}
	a = Math.abs(a);
	b = Math.abs(b);
	if (a === 0 && b === 0) {
		throw new Error(`gcd(0,0) not defined`);
	}
	if (a === 0 || b === 0) {
		return Math.max(a, b);
	}
	// euclidean algorithm
	while (b !== 0) {
		[a, b] = [b, a % b];
	}
	return a;
}
