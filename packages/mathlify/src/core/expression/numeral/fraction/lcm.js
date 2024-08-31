import { gcd } from './gcd.js';

/**
 * lcm of two numbers
 * @param {number} a - integer 1
 * @param {number} b - integer 2
 * @returns {number} lcm
 */
export function lcm(a, b) {
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		throw new Error(`Non-integers (${a}, ${b}) received in lcm function`);
	}
	if (a === 0 || b === 0) {
		throw new Error(`lcm(0) is undefined`);
	}
	const abs_gcd = gcd(a, b);
	return Math.abs(a * b) / abs_gcd;
}
