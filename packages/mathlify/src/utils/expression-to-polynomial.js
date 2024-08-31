import { Expression } from '../core/expression/expression.js';
import { Polynomial } from '../core/polynomial/polynomial.js';
import { arrayHasLengthEqualTo } from './typescript/array-length.js';
/** @typedef {import('../core/expression/expression.js').Variable} Variable*/

// /**
//  *
//  * @param {Expression} exp
//  * @param {{variable?: string|Variable, ascending?: boolean}} [options]
//  * @returns {Polynomial}
//  */
// export function expressionToPolynomial(exp, options) {
// 	if (exp instanceof Polynomial) return exp;
// 	if (exp.node.type === 'numeral') {
// 		return new Polynomial([exp.node], options);
// 	} else if (exp.node.type === 'variable') {
// 		const coeffs = options?.ascending ? [0, 1] : [1, 0];
// 		return new Polynomial(coeffs, { ...options, variable: exp.node.name });
// 	} else if (exp.node.type === 'exponent') {
// 		const n = exp.node.power._getNumeral();
// 		if (!n.is.integer() || n.is.negative())
// 			throw new Error(`power must be non-negative integer`);
// 		const base = exp.node.base.node;
// 		if (base.type !== 'variable')
// 			throw new Error(`base of an exponent must be a variable`);
// 		return Polynomial.ofDegree(n.valueOf(), {
// 			...options,
// 			variable: base.name,
// 		});
// 	} else if (exp.node.type === 'product') {
// 		if (!arrayHasLengthEqualTo(exp.node.factors, 1))
// 			throw new Error(`expect only one factor in a product`);
// 		const factor = exp.node.factors[0];
// 		return expressionToPolynomial(factor, options).times(exp.node.coeff);
// 	} else if (exp.node.type === 'sum') {
// 		// hack to ensure correct variable when starting with sums;
// 		const termsExp = exp.node.terms;
// 		if (termsExp.length <= 1) throw new Error('expect at least two terms');
// 		const terms =
// 			/** @type {Expression} */ (termsExp[0]).node.type === 'numeral'
// 				? termsExp.toReversed()
// 				: termsExp;
// 		const polys = terms.map((t) => expressionToPolynomial(t, options));
// 		return polys.reduce((prev, p) => prev.plus(p));
// 	}
// 	throw new Error('expression form does not fit a polynomial');
// }

/**
 *
 * @param {Expression} exp
 * @param {string|Variable} [variable='x']
 * @param {{ascending?: boolean}} [options]
 * @returns {Polynomial}
 */
//export function expressionToPolynomial(exp, variable = 'x', options) {
export function expressionToPolynomial(exp, variable = 'x', options) {
	if (exp instanceof Polynomial) return exp;
	if (!exp.contains(variable))
		return new Polynomial([exp], { variable, ...options });
	const node = exp.node;
	switch (node.type) {
		case 'variable':
			const coeffs = options?.ascending ? [0, 1] : [1, 0];
			return new Polynomial(coeffs, { ...options, variable });
		case 'exponent':
			const n = node.power.node;
			if (n.type !== 'numeral' || !n.is.integer() || n.is.negative())
				throw new Error(`power must be non-negative integer`);
			const base = node.base.node;
			if (base.type !== 'variable')
				throw new Error(`base of an exponent must be a variable`);
			return Polynomial.ofDegree(n.valueOf(), {
				...options,
				variable,
			});
		case 'product':
			/** @type {Expression[]} */
			const constants = [];
			/** @type {Expression[]} */
			const variables = [];
			for (const factor of node.factors) {
				if (factor.contains(variable)) {
					variables.push(factor);
				} else {
					constants.push(factor);
				}
			}
			if (variables.length === 0)
				return new Polynomial([[...constants]], {
					variable,
					...options,
				});
			if (arrayHasLengthEqualTo(variables, 1)) {
				const [xTerm] = variables;
				if (xTerm.node.type === 'variable') {
					const coeffs = options?.ascending
						? [0, [node.coeff, ...constants]]
						: [[node.coeff, ...constants], 0];
					return new Polynomial(coeffs, { ...options, variable });
				} else if (
					xTerm.node.type === 'exponent' &&
					xTerm.node.power.node.type === 'numeral' &&
					xTerm.node.power.node.is.integer() &&
					xTerm.node.power.node.is.positive()
				) {
					return Polynomial.ofDegree(xTerm.node.power.node.valueOf(), {
						...options,
						variable,
						coeff: new Expression([node.coeff, ...constants]),
					});
				}
				throw new Error(`unsupported variable term ${xTerm}`);
			}
			throw new Error(`unsupported variable term ${node}`);
		case 'sum':
			const terms = node.terms;
			if (terms.length <= 1) throw new Error('expect at least two terms');
			const polys = terms.map((t) =>
				expressionToPolynomial(t, variable, options),
			);
			return polys.reduce((prev, p) => prev.plus(p));
		default:
			throw new Error(`unsupported expression type ${node}`);
	}
}
