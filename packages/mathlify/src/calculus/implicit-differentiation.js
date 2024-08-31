import { Expression, Variable } from '../core/expression/expression.js';
import { Cos, Logarithm, Sin, Sqrt } from '../fns/index.js';
/** @typedef {import('../core/expression/expression.js').Numeral} Numeral */

const d = `\\mathop{}\\!\\mathrm{d}`;

/**
 * @param {Expression} exp
 * @param {string} [variable='x']
 * @returns {Expression}
 */
export function implicitlyDifferentiate(exp, variable = 'x') {
	if (!exp.is.variable()) return new Expression(0);
	switch (exp.node.type) {
		case 'variable':
			if (variable === exp.node.name) return new Expression(1);
			// implicitly differentiate
			const dydxString = `d${exp.node.name}d${variable}`;
			const dydx = new Variable(dydxString, {
				typesetString: `\\frac{${d}${exp.node}}{${d}${variable}}`,
			});
			return new Expression(dydx);
		case 'sum':
			const sum = exp.node;
			const differentiatedTerms = sum.terms.map((term) =>
				implicitlyDifferentiate(term.clone(), variable),
			);
			// TODO: simplify?
			return new Expression(['+', ...differentiatedTerms]).simplify();
		case 'exponent':
			const exponent = exp.node;
			const base = exponent.base.clone();
			const power = exponent.power.clone();
			if (power.is.variable()) {
				if (
					base.node.type === 'variable' &&
					(base.node.name === 'e' || base.node.name === '\\mathrm{e}')
				) {
					const fPrime = implicitlyDifferentiate(power, variable);
					return new Expression([fPrime, exp.clone()]).simplify();
				}
				throw new Error(
					'Differentiation of exponentials with respect to a variable is not supported yet.',
				);
			}
			// base guaranteed to contain variable. apply power rule
			return new Expression([
				power,
				implicitlyDifferentiate(base),
				[base, '^', power.minus(1)],
			]).simplify();
		case 'product':
			const prod = exp.node;
			/** @type {Expression[]} */
			const variables = [];
			/** @type {Expression[]} */
			const constants = [];
			for (const factor of prod.factors) {
				if (factor.is.variable()) {
					variables.push(factor.clone());
				} else {
					constants.push(factor.clone());
				}
			}
			if (variables.length === 1) {
				return new Expression([
					prod.coeff.clone(),
					...constants,
					implicitlyDifferentiate(/** @type {Expression} **/ (variables[0])),
				]).simplify();
			} else {
				// TODO: support product rule
				throw new Error(
					'Differentiation of products with multiple variables is not supported yet.',
				);
			}
		case 'quotient':
			const quotient = exp.node;
			const num = quotient.num.clone();
			const den = quotient.den.clone();
			if (num.is.variable() && den.is.variable()) {
				return new Expression([
					[
						'+',
						[implicitlyDifferentiate(num), den],
						[-1, num, implicitlyDifferentiate(den)],
					],
					'/',
					[den.clone(), '^', 2],
				]);
			} else if (num.is.variable()) {
				return new Expression([
					implicitlyDifferentiate(num),
					'/',
					den,
				]).simplify();
			} else {
				// only den is variable
				// TODO: support (a)/(bf(x)) to a/b (f(x))^{-1} instead of keeping b in the negative power
				const product =
					den.node.type === 'product'
						? new Expression([
								[num, '/', den.node.coeff],
								[new Expression([...den.node.factors]), '^', -1],
							]).simplify()
						: new Expression([num, [den, '^', -1]]).simplify();
				return implicitlyDifferentiate(product, variable);
			}
		case 'fn':
			if (exp.node instanceof Sqrt) {
				const fPrime = implicitlyDifferentiate(exp.node.argument, variable);
				return new Expression([fPrime, '/', [2, exp.clone()]]).simplify();
			} else if (exp.node instanceof Logarithm) {
				const fPrime = implicitlyDifferentiate(exp.node.argument, variable);
				return new Expression([
					fPrime,
					'/',
					exp.node.argument.clone(),
				]).simplify();
			} else if (exp.node instanceof Sin) {
				const fPrime = implicitlyDifferentiate(exp.node.argument, variable);
				return new Expression([
					fPrime,
					new Cos(exp.node.argument.clone()),
				]).simplify();
			} else if (exp.node instanceof Cos) {
				const fPrime = implicitlyDifferentiate(exp.node.argument, variable);
				return new Expression([
					-1,
					fPrime,
					new Sin(exp.node.argument.clone()),
				]).simplify();
			}
		default:
			throw new Error('Differentiation of this type not supported');
	}
}
