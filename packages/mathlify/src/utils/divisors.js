/**
 * gets positive divisors of n
 * @param {number} n
 * @returns {number[]} positive divisors of n
 */
export function divisors(n) {
	if (!Number.isInteger(n) || n === 0)
		throw new Error('n must be a non-zero integer');
	const result = [];
	for (let i = 1; i <= Math.floor(Math.sqrt(Math.abs(n))); i++) {
		if (n % i === 0) {
			result.push(i, n / i);
		}
	}
	return result.toSorted((a, b) => a - b);
}
