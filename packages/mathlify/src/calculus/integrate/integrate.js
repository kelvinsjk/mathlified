import { Expression } from '../../core/expression/expression.js';
import { Abs, Cos, Sin, Sqrt, logTerm } from '../../fns/index.js';
import { getLinearPolyLeadingCoeff } from './utils.js';
import { arrayHasLengthEqualTo } from '../../utils/typescript/array-length.js';
import { integrateTrig } from './trigo.js';
import { byParts } from './by-parts.js';
/** @typedef {import('../../core/expression/expression.js').Numeral} Numeral */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */

/**
 * @param {Expression} exp
 * @param {string} [variable='x']
 * @returns {Expression}
 */

export const integrate = {
	/**
	 * @param {import('../../index.js').Shorthand} exp
	 * @param {string|Variable} [variable='x']
	 * @param {{c?: true|number|Numeral|string, absolute?: boolean}} [options]
	 * @returns {Expression}
	 */
	standard: (exp, variable = 'x', options) => {
		exp = new Expression(exp);
		if (!exp.contains(variable)) {
			const kx = new Expression([exp.clone(), variable]);
			return appendConstant(kx, options?.c);
		}
		switch (exp.node.type) {
			case 'variable':
				return appendConstant(
					new Expression([
						[1, '/', 2],
						[exp.clone(), '^', 2],
					]),
					options?.c,
				);
			case 'sum':
				const sum = exp.node;
				const integratedTerms = sum.terms.map((term) =>
					integrate.standard(term.clone(), variable),
				);
				return appendConstant(
					new Expression(['+', ...integratedTerms]).simplify(),
					options?.c,
				);
			case 'exponent':
				const exponent = exp.node;
				const base = exponent.base.clone();
				const power = exponent.power.clone();
				if (power.contains(variable)) {
					if (
						base.node.type === 'variable' &&
						(base.node.name === 'e' || base.node.name === '\\mathrm{e}')
					) {
						const k = getLinearPolyLeadingCoeff(power, variable);
						return appendConstant(
							new Expression([exponent.clone(), '/', k]).simplify(),
							options?.c,
						);
					}
					throw new Error(
						'Differentiation of exponentials with respect to a variable is not supported yet.',
					);
				}
				// base guaranteed to contain variable. apply power rule
				// TODO: handle case of n=-1
				if (power.node.type === 'numeral') {
					const k = getLinearPolyLeadingCoeff(base, variable);
					if (power.node.is.negative_one()) {
						const argument = options?.absolute
							? new Abs(base.clone())
							: base.clone();
						return appendConstant(
							new Expression([logTerm(argument), '/', k]).simplify(),
							options?.c,
						);
					}
					return appendConstant(
						new Expression([
							k.reciprocal().times(power.node.plus(1)),
							[base.clone(), '^', power.node.plus(1)],
						]).simplify(),
						options?.c,
					);
				}
				throw new Error(`Integration of ${exp} not supported.`);
			case 'product':
				const prod = exp.node;
				/** @type {Expression[]} */
				const variables = [];
				/** @type {Expression[]} */
				const constants = [];
				for (const factor of prod.factors) {
					if (factor.contains(variable)) {
						variables.push(factor.clone());
					} else {
						constants.push(factor.clone());
					}
				}
				if (arrayHasLengthEqualTo(variables, 1)) {
					return appendConstant(
						new Expression([
							prod.coeff.clone(),
							...constants,
							integrate.standard(variables[0], variable),
						]).simplify(),
						options?.c,
					);
				}
				throw new Error(
					'Integration of products with multiple variables is not supported yet.',
				);
			case 'quotient':
				const quotient = exp.node;
				const num = quotient.num.clone();
				const den = quotient.den.clone();
				if (num.contains(variable) && den.contains(variable))
					throw new Error(`Integration of quotients not supported.`);
				if (num.contains(variable))
					return appendConstant(
						new Expression([
							integrate.standard(num, variable),
							'/',
							den,
						]).simplify(),
						options?.c,
					);
				// only den contains variable
				if (den.node instanceof Sqrt) {
					const k = getLinearPolyLeadingCoeff(den.node.argument, variable);
					return appendConstant(
						new Expression([
							k.reciprocal().times(2),
							den.node.clone(),
						]).simplify(),
						options?.c,
					);
				}
				const product =
					den.node.type === 'product'
						? new Expression([
								[num, '/', den.node.coeff],
								[new Expression([...den.node.factors]), '^', -1],
							]).simplify()
						: new Expression([num, [den, '^', -1]]).simplify();
				return integrate.standard(product, variable, options);
			case 'fn':
				if (exp.node instanceof Sqrt) {
					const k = getLinearPolyLeadingCoeff(exp.node.argument, variable);
					return appendConstant(
						new Expression([
							k.reciprocal().times(2).divide(3),
							[exp.node.argument.clone(), '^', [3, '/', 2]],
						]).simplify(),
						options?.c,
					);
				} else if (exp.node instanceof Sin || exp.node instanceof Cos) {
					return appendConstant(integrateTrig(exp, variable), options?.c);
				}
			default:
				throw new Error('Integration of this type not supported');
		}
	},
	/**
	 * @param {Expression} exp
	 * @param {string} [variable='x']
	 * @param {{c?: true|number|Numeral|string}} [options]
	 * @returns {Expression}
	 */
	byParts: (exp, variable = 'x', options) => {
		return appendConstant(byParts(exp, variable), options?.c);
	},
};

/**
 *
 * @param {Expression} expression
 * @param {true|number|Numeral|string} [constant]
 */
function appendConstant(expression, constant) {
	if (constant === undefined) return expression;
	const c = constant === true ? 'C' : constant;
	return new Expression(['+', expression, c]).simplify();
}
