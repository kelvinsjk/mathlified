import { Expression } from '../../core/expression/expression.js';
import { Cos, Sin } from '../../fns/index';
import { integrateTrig } from './trigo.js';
import { arrayHasLengthEqualTo } from '../../utils/typescript/array-length';
import { differentiate } from '../differentiate.js';
/** @typedef {import('../../core/expression/expression.js').Exponent} Exponent */
/**
 * @param {Expression} exp
 * @param {string} [variable='x']
 * @returns {Expression}
 */
export const byParts = (exp, variable = 'x') => {
	// TODO: constant and logarithm/arc trig case
	// base case 1
	if (exp.node instanceof Sin || exp.node instanceof Cos) {
		return integrateTrig(exp, variable);
	} else if (exp.node.type === 'quotient' && !exp.node.den.contains(variable)) {
		return new Expression([byParts(exp.node.num, variable), '/', exp.node.den]);
	}

	if (exp.node.type !== 'product')
		throw new Error(
			'The expression must be a product to apply integration by parts',
		);
	const [coeff, factors] = [exp.node.coeff, exp.node.factors];
	// base case 2
	if (arrayHasLengthEqualTo(factors, 1)) {
		const integrand = factors[0];
		if (integrand.node instanceof Sin || integrand.node instanceof Cos)
			return integrateTrig(integrand, variable).times(coeff);
	}
	if (!arrayHasLengthEqualTo(factors, 2))
		throw new Error(
			'The expression must have exactly 2 factors to apply integration by parts',
		);
	let [u, dv] = factors;
	if ((u instanceof Sin || u instanceof Cos) && dv.node.type === 'exponent')
		[u, dv] = [dv, u];
	if (
		(u.node.type === 'exponent' || u.node.type === 'variable') &&
		(dv.node instanceof Sin || dv.node instanceof Cos)
	) {
		const integrand = new Expression([
			coeff,
			differentiate(u, variable),
			integrateTrig(dv, variable),
		]).simplify();
		return new Expression([
			'+',
			[coeff, u, integrateTrig(dv, variable)],
			[-1, byParts(integrand, variable)],
		]);
	}
	throw new Error('Unable to apply integration by parts');
};
