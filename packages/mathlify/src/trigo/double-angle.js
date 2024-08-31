import { Cos, Sin } from '../fns/index';
import { Expression } from '../index.js';
import { arrayHasLengthEqualTo } from '../utils/typescript/array-length.js';

/**
 * @param {Expression} exp
 * @param {{target?: number|number[], variant?: 'c'|'s'|'cs'}} [options] - target is required for sum expressions to determine which term to apply formula to. variant is required for cosine double angle
 * @returns {Expression}
 */
export const doubleAngle = (exp, options) => {
	if (exp.node instanceof Sin) {
		const A = exp.node.argument.divide(2);
		return new Expression([2, new Sin(A), new Cos(A)]).simplify();
	} else if (exp.node instanceof Cos) {
		const variant = options?.variant;
		if (variant === undefined)
			throw new Error('Variant is required for cosine double angle');
		const A = exp.node.argument.divide(2);
		return variant === 'c'
			? new Expression(['+', [2, [new Cos(A), '^', 2]], -1]).simplify()
			: variant === 's'
				? new Expression(['+', 1, [-2, [new Sin(A), '^', 2]]]).simplify()
				: new Expression([
						'+',
						[new Cos(A), '^', 2],
						[-1, [new Sin(A), '^', 2]],
					]).simplify();
	} else if (
		exp.node.type === 'product' &&
		arrayHasLengthEqualTo(exp.node.factors, 1)
	) {
		return doubleAngle(exp.node.factors[0].clone(), options)
			.times(exp.node.coeff)
			.simplify();
	} else if (exp.node.type === 'sum') {
		const target = options?.target;
		if (target === undefined)
			throw new Error('Target is required for sum expressions');
		const targetArr = Array.isArray(target) ? target : [target];
		const terms = exp.node.terms.map((term, i) =>
			targetArr.includes(i) ? doubleAngle(term, options) : term.clone(),
		);
		return new Expression(['+', ...terms]).simplify();
	} else if (
		exp.node.type === 'exponent' &&
		(exp.node.base.node instanceof Cos || exp.node.base.node instanceof Sin)
	) {
		return new Expression([
			doubleAngle(exp.node.base, options),
			'^',
			exp.node.power,
		]).simplify();
	}
	throw new Error(
		'Unable to convert this this expression using the double angle formula',
	);
};
