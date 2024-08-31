import { Cos, Sin } from '../fns/index';
import { Expression } from '../index.js';
import { arrayHasLengthEqualTo } from '../utils/typescript/array-length.js';

/**
 * @param {Expression} exp
 * @returns {Expression}
 */
export const productToSum = (exp) => {
	const half = [1, '/', 2];
	if (exp.node.type !== 'product')
		throw new Error(
			'The expression must be a product to apply the reversed factor formula',
		);
	const factors = exp.node.factors;
	if (!arrayHasLengthEqualTo(factors, 2))
		throw new Error(
			'The expression must have exactly 2 factors to apply the reversed factor formula',
		);
	const [firstFactor, secondFactor] = factors;
	if (firstFactor.node instanceof Sin && secondFactor.node instanceof Cos) {
		const [A, B] = [firstFactor.node.argument, secondFactor.node.argument];
		return new Expression([
			'+',
			[half, new Sin(A.plus(B))],
			[half, new Sin(A.minus(B))],
		]).simplify();
	} else if (
		firstFactor.node instanceof Cos &&
		secondFactor.node instanceof Sin
	) {
		const [A, B] = [firstFactor.node.argument, secondFactor.node.argument];
		return new Expression([
			'+',
			[half, new Sin(A.plus(B))],
			[-1, half, new Sin(A.minus(B))],
		]).simplify();
	} else if (
		firstFactor.node instanceof Cos &&
		secondFactor.node instanceof Cos
	) {
		const [A, B] = [firstFactor.node.argument, secondFactor.node.argument];
		return new Expression([
			'+',
			[half, new Cos(A.plus(B))],
			[half, new Cos(A.minus(B))],
		]).simplify();
	} else if (
		firstFactor.node instanceof Sin &&
		secondFactor.node instanceof Sin
	) {
		const [A, B] = [firstFactor.node.argument, secondFactor.node.argument];
		return new Expression([
			'+',
			[-1, half, new Cos(A.plus(B))],
			[half, new Cos(A.minus(B))],
		]).simplify();
	}
	throw new Error(
		'Unable to convert this product using the product to sum formula',
	);
};
