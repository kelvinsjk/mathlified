import { combineFraction } from '../algebra/combine-fraction.js';
import {
	Expression,
	Variable,
	e,
	pi as piVariable,
} from '../core/expression/expression.js';
import { Sqrt, trigTerm, simplifySurd } from '../fns/index.js';
import { Tan } from '../fns/trigo/trigo.js';
import { greek } from '../utils/greek-variable.js';
/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */

export const i = new Variable('i', {
	constantValue: NaN,
	typesetString: '\\mathrm{i}',
});

export class Complex extends Expression {
	/** @type {'cartesian'|'exponential'} */
	form;
	/** @type {[Expression, Expression]} (x,y) or (r, theta) depending on form */
	components;

	/**
	 * @param {Shorthand} xOrR
	 * @param {Shorthand} yOrTheta
	 * @param {{polar?: boolean}} [options] - defaults to cartesian mode
	 */
	constructor(xOrR, yOrTheta, options) {
		const xOrRExp = new Expression(xOrR);
		const yOrThetaExp = new Expression(yOrTheta);
		const expressionConstructor = options?.polar
			? [
					xOrRExp,
					[
						e,
						'^',
						yOrThetaExp.is.negative()
							? [-1, i, yOrThetaExp.abs()]
							: [i, yOrThetaExp],
					],
				]
			: ['+', xOrRExp, [yOrThetaExp, i]];
		// TODO: handle simplification of polar form where i isn't combined with angle
		let exp = new Expression(expressionConstructor);
		if (!options?.polar) exp = exp.simplify();
		super(exp);
		this.form = options?.polar ? 'exponential' : 'cartesian';
		this.components = [xOrRExp, yOrThetaExp];
	}

	get real() {
		if (this.form === 'cartesian') return this.components[0];
		const [r, theta] = this.components;
		return new Expression([
			r.clone(),
			trigTerm('cos', theta.clone()),
		]).simplify();
	}
	get imag() {
		if (this.form === 'cartesian') return this.components[0];
		const [r, theta] = this.components;
		return new Expression([
			r.clone(),
			trigTerm('sin', theta.clone()),
		]).simplify();
	}
	get mod() {
		if (this.form === 'exponential') return this.components[0];
		const [x, y] = this.components;
		Expression.RegisterCustomSimplifier(simplifySurd);
		return new Expression(new Sqrt(['+', x.square(), y.square()])).simplify();
	}
	get arg() {
		if (this.form === 'exponential') return this.components[1];
		const [x, y] = this.components;
		const xNegative = `${x}`.startsWith(`-`);
		const yNegative = `${y}`.startsWith(`-`);
		const pi = new Expression(piVariable);
		if (x.toString() === '0') {
			return yNegative ? pi.divide(2).negative() : pi.divide(2);
		}

		const alpha = Tan.inverse(y.abs().divide(x.abs()));
		if (xNegative) {
			const piMinusAlpha = pi.minus(alpha);
			const theta = yNegative ? pi.minus(alpha).negative() : piMinusAlpha;
			return combineFraction(theta);
		} else {
			return yNegative ? alpha.negative() : alpha;
		}
	}

	/**
	 * @returns {Complex}
	 */
	conjugate() {
		if (this.form === 'cartesian')
			return new Complex(this.real, this.imag.negative());
		return new Complex(this.mod, this.arg.negative(), { polar: true });
	}

	/**
	 * @param {Complex} z2
	 */
	times(z2) {
		if (this.form === 'exponential') {
			const arg = combineFraction(this.arg.plus(z2.arg));
			return new Complex(this.mod.times(z2.mod), arg, {
				polar: true,
			});
		}
		// TODO: implement multiplication for cartesian form
		throw new Error(
			'Complex multiplication for cartesian form not implemented yet',
		);
	}
	/**
	 * @param {Complex} z2
	 */
	divide(z2) {
		if (this.form === 'exponential') {
			const arg = combineFraction(this.arg.minus(z2.arg));
			return new Complex(this.mod.divide(z2.mod), arg, {
				polar: true,
			});
		}
		// TODO: implement division for cartesian form
		throw new Error('Complex division for cartesian form not implemented yet');
	}
	/**
	 * @param {Shorthand} n
	 */
	pow(n) {
		if (this.form === 'exponential') {
			return new Complex(this.mod.pow(n), this.arg.times(n), { polar: true });
		}
		throw new Error('Complex powers not implemented for cartesian form');
	}

	/**
	 * @returns {Complex}
	 */
	toExponential() {
		if (this.form === 'exponential') return this;
		return new Complex(this.mod, this.arg, { polar: true });
	}
	/**
	 * @returns {Complex}
	 */
	toCartesian() {
		if (this.form === 'cartesian') return this;
		return new Complex(this.real, this.imag);
	}

	clone() {
		return new Complex(this.components[0].clone(), this.components[1].clone(), {
			polar: this.form === 'exponential',
		});
	}

	/**
	 * @param {string} [x='x']
	 * @param {string} [y='y']
	 * @returns {Complex}
	 */
	static Cartesian(x = 'x', y = 'y') {
		return new Complex(x, y);
	}
	/**
	 * @param {string} [r='r']
	 * @param {string|Variable} [theta]
	 */
	static Exponential(r = 'r', theta = greek('theta')) {
		return new Complex(r, theta, { polar: true });
	}

	static I = new Complex(0, 1);
}

/**
 * Simplifies
 * - i^2 into -1
 * - sqrt{a}^2 into a
 * @param {Expression} expression
 * @returns {Expression}
 */
export function simplifyComplex(expression) {
	if (
		expression.node.type === 'exponent' &&
		expression.node.base.node.type === 'variable' &&
		expression.node.base.node.name === 'i' &&
		expression.node.power.node.type === 'numeral' &&
		expression.node.power.node.is.integer() &&
		expression.node.power.node.is.positive()
	) {
		const n = expression.node.power.node.number.valueOf();
		const isEven = n % 2 === 0;
		return isEven ? new Expression(-1) : Complex.I;
	}
	return expression;
}
