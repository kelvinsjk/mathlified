import { Sin, Cos } from '../../fns/index.js';
import { Expression } from '../../core/expression/expression.js';
import { getLinearPolyLeadingCoeff } from './utils.js';

/** @typedef {import('../../core/expression/expression.js').Variable} Variable */

/**
 * @param {Expression} exp
 * @param {string|Variable} [variable='x']
 * @returns {Expression}
 */
export function integrateTrig(exp, variable = 'x') {
	if (exp.node instanceof Sin) {
		// TODO: report answer as cos x / k instead of 1/k cos x?
		const k = getLinearPolyLeadingCoeff(exp.node.argument, variable);
		return new Expression([
			k.reciprocal().times(-1),
			new Cos(exp.node.argument.clone()),
		]).simplify();
	} else if (exp.node instanceof Cos) {
		const k = getLinearPolyLeadingCoeff(exp.node.argument, variable);
		return new Expression([
			k.reciprocal(),
			new Sin(exp.node.argument.clone()),
		]).simplify();
	}
	throw new Error('Integration not valid for non-trigonometric functions');
}
