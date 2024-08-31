import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';
import { Expression } from '../../core/expression/expression.js';
/** @typedef {import('../../core/expression/expression.js').Numeral} Numeral */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */

/**
 * @param {Expression} expression
 * @param {string|Variable} variable
 * @returns {Numeral|Expression}
 */
export function getLinearPolyLeadingCoeff(expression, variable) {
	const poly = expressionToPolynomial(expression, variable);
	if (poly.degree !== 1) {
		throw new Error(
			'Integration of powers only supported when inner function is a linear polynomial.',
		);
	}
	const leadingCoeff = poly.leadingCoefficient;
	return leadingCoeff.type === 'numeral'
		? leadingCoeff
		: new Expression(leadingCoeff);
}
