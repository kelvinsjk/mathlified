import { Expression, Numeral } from '../core/expression/expression.js';
import { arrayHasLengthEqualTo } from '../utils/typescript/array-length.js';

/**
 * combines fractions within a Sum, with full simplification
 * @param {Expression} exp
 * @param {{target?: number[], targets?:number[][]}} [options] - targets take precedence over target
 * @returns {Expression}
 */
export function combineFraction(exp, options) {
	// TODO: return working for steps
	if (options?.target === undefined && options?.targets === undefined) {
		if (exp.node.type === 'quotient') {
			return new Expression([
				combineFraction(exp.node.num.clone(), options),
				'/',
				combineFraction(exp.node.den.clone(), options),
			]);
		} else if (exp.is.negativeUnit()) {
			const q = exp._getProductTerm().node;
			if (q.type === 'quotient') {
				return new Expression([
					-1,
					[
						combineFraction(q.num.clone(), options),
						'/',
						combineFraction(q.den.clone(), options),
					],
				]);
			}
		}
		const commonDenominator = common_denominator(exp);
		if (!commonDenominator) return exp.clone();
		const combinedFraction = combine_fraction(commonDenominator);
		if (!combinedFraction) return exp.clone();
		return combinedFraction.expand({ numeratorOnly: true }).simplify();
	}
	// targets provided: expression must be a sum
	// TODO: throw when indices are repeated
	if (exp.node.type !== 'sum')
		throw new Error('combineFraction only supported for sums');
	const targets = options.targets ?? [options.target ?? []];
	/** @type {Expression[]} */
	const subSums = [];
	/** @type {number[]} */
	const indices = [];
	for (const target of targets) {
		/** @type {Expression[]} */
		const terms = [];
		for (const i of target) {
			indices.push(i);
			const term = exp.node.terms[i];
			if (term) terms.push(term);
		}
		subSums.push(new Expression(['+', ...terms]));
	}
	const remainingTerms = exp.node.terms.filter((_, i) => !indices.includes(i));
	return new Expression([
		'+',
		...subSums.map((s) => combineFraction(s)),
		...remainingTerms,
	]);
}

/**
 * @param {Expression} exp
 * @returns {Expression|undefined}
 */
function common_denominator(exp) {
	const sum = exp.clone().node;
	if (!(sum.type === 'sum')) return undefined;
	const denExp = denominator_lcm(...sum.terms);
	const den = denExp.node;
	if (den.type === 'numeral' && den.is.one()) return undefined;
	/** @type {Expression[]} */
	const terms = [];
	for (const term of sum.terms) {
		const node = term.node;
		if (node.type === 'numeral') {
			if (node.is.negative()) {
				terms.push(
					new Expression([
						-1,
						[new Expression([node.abs(), den]).simplify(), '/', den],
					]),
				);
			} else {
				terms.push(
					new Expression([
						new Expression([node, den]).simplify(),
						'/',
						den.clone(),
					]),
				);
			}
		} else if (node.type === 'quotient') {
			const multiple = denExp._divide_by_factor(node.den);
			const num =
				multiple.node.type === 'product'
					? new Expression([
							multiple.node.coeff,
							node.num,
							...multiple.node.factors,
						]).simplify()
					: new Expression([multiple, node.num]).simplify();
			terms.push(new Expression([num, '/', den]));
		} else if (node.type === 'product' && node.coeff.is.negative()) {
			if (
				arrayHasLengthEqualTo(node.factors, 1) &&
				node.factors[0].node.type === 'quotient'
			) {
				const multiple = denExp._divide_by_factor(node.factors[0].node.den);
				const num =
					multiple.node.type === 'product'
						? new Expression([
								multiple.node.coeff,
								node.factors[0].node.num,
								...multiple.node.factors,
							]).simplify()
						: new Expression([multiple, node.factors[0].node.num]).simplify();
				terms.push(new Expression([-1, [num, '/', den]]));
			} else {
				const num = new Expression([
					node.coeff.abs(),
					...node.factors,
					den,
				]).simplify();
				const p = new Expression([-1, [num, '/', den]]);
				terms.push(p);
			}
		} else {
			terms.push(
				new Expression([new Expression([node, den]).simplify(), '/', den]),
			);
		}
	}
	return new Expression(['+', ...terms]);
}

/**
 *
 * @param {Expression} exp
 * @returns {Expression|undefined}
 */
function combine_fraction(exp) {
	/** @type {(Expression)[]} */
	const terms = [];
	const sum = exp.node;
	if (!(sum.type === 'sum')) {
		console.warn('common denominator only supported for sums');
		return undefined;
	}
	/** @type {Expression|undefined} */
	let den = undefined;
	for (const term of sum.terms) {
		const node = term.node;
		if (node.type === 'quotient') {
			den = den ?? node.den;
			terms.push(node.num);
		} else if (
			node.type === 'product' &&
			node.coeff.is.negative() &&
			arrayHasLengthEqualTo(node.factors, 1) &&
			node.factors[0].node.type === 'quotient'
		) {
			const q = node.factors[0].node;
			den = den ?? q.den;
			terms.push(new Expression([-1, q.num]));
		}
		//! assumption: no other cases should be possible
	}
	if (den === undefined) return undefined;
	return new Expression([['+', ...terms], '/', den]);
}

/**
 * get denominator lcm of expressions
 * @param {...Expression} expressions
 * @returns {Expression}
 */
function denominator_lcm(...expressions) {
	if (expressions.length === 0)
		throw new Error('Cannot find denominator lcm of empty array');
	if (arrayHasLengthEqualTo(expressions, 1)) {
		const node = expressions[0].node;
		if (node.type === 'numeral') {
			return new Expression(Math.abs(node.number.den));
		} else if (node.type === 'quotient') {
			return node.den.clone();
		} else if (
			node.type === 'product' &&
			node.is.negative() &&
			arrayHasLengthEqualTo(node.factors, 1)
		) {
			return denominator_lcm(node.factors[0]);
		}
		return new Expression(1);
	}
	if (arrayHasLengthEqualTo(expressions, 2)) {
		const [a, b] = /**  */ expressions;
		const aDen = denominator_lcm(a);
		const bDen = denominator_lcm(b);
		return expression_lcm_two(aDen, bDen);
	}
	// more than 2 expressions
	const dens = /** @type {[Expression, Expression, ...Expression[]]} */ (
		expressions.map((exp) => denominator_lcm(exp))
	);
	let multiple = expression_lcm_two(dens[0], dens[1]);
	dens.shift();
	dens.shift();
	for (const exp of dens) {
		multiple = expression_lcm_two(multiple, exp);
	}
	return multiple;
}

/**
 * get lcm of two expressions
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @returns {Expression}
 */
function expression_lcm_two(exp1, exp2) {
	const a = exp1.clone().node;
	const b = exp2.clone().node;
	if (a.type === 'product') {
		if (b.type === 'product') {
			// lexical string: {power, expression}
			/** @type {Object.<string,{power: Numeral, expression: Expression}>} */
			const termMap = {};
			/** @type {string[]} */
			const orderedKeys = [];
			// loop through a
			for (const factor of a.factors) {
				const node = factor.node;
				if (node.type === 'exponent' && node.power.node.type === 'numeral') {
					const key = node.base._to_lexical_string();
					orderedKeys.push(key);
					termMap[key] = { power: node.power.node, expression: node.base };
				} else {
					const key = node._to_lexical_string();
					orderedKeys.push(key);
					termMap[key] = { power: new Numeral(1), expression: factor };
				}
			}
			// loop through b
			for (const factor of b.factors) {
				const node = factor.node;
				if (node.type === 'exponent' && node.power.node.type === 'numeral') {
					const key = node.base._to_lexical_string();
					const val = termMap[key];
					if (val) {
						val.power = Numeral.max(node.power.node, val.power);
					} else {
						termMap[key] = { power: node.power.node, expression: node.base };
						orderedKeys.push(key);
					}
				} else {
					const key = node._to_lexical_string();
					const val = termMap[key];
					if (val) {
						val.power = Numeral.max(1, val.power);
					} else {
						termMap[key] = { power: new Numeral(1), expression: factor };
						orderedKeys.push(key);
					}
				}
			}
			/** @type {Expression[]} */
			const factors = [];
			for (const key of orderedKeys) {
				const val = termMap[key];
				if (val) {
					const { power, expression } = val;
					if (power.is.one()) {
						factors.push(expression);
					} else if (power.is.nonzero()) {
						factors.push(new Expression([expression, '^', power]));
					}
				}
			}
			return new Expression([
				Numeral.lcm(a.coeff, b.coeff),
				...factors,
			]).simplify();
		} else if (b.type === 'numeral') {
			return new Expression([Numeral.lcm(a.coeff, b), ...a.factors]).simplify();
		} else {
			/** @type {Expression[]} */
			const factors = [];
			let noCommonFactor = true;
			for (const f of a.factors) {
				const fNode = f.node;
				if (
					fNode.type === 'exponent' &&
					fNode.power.node.type === 'numeral' &&
					b.type === 'exponent' &&
					b.power.node.type === 'numeral' &&
					fNode.base._to_lexical_string() === b.base._to_lexical_string()
				) {
					factors.push(
						new Expression([
							fNode.base,
							'^',
							new Expression(Numeral.max(fNode.power.node, b.power.node)),
						]),
					);
					noCommonFactor = false;
				} else if (
					fNode.type === 'exponent' &&
					fNode.power.node.type === 'numeral' &&
					fNode.base._to_lexical_string() === b._to_lexical_string()
				) {
					factors.push(
						new Expression([fNode.base, '^', Numeral.max(fNode.power.node, 1)]),
					);
					noCommonFactor = false;
				} else if (fNode._to_lexical_string() === b._to_lexical_string()) {
					factors.push(f);
					noCommonFactor = false;
				} else {
					factors.push(f);
				}
			}
			if (noCommonFactor) {
				factors.push(exp2);
			}
			return new Expression([a.coeff, ...factors]).simplify();
		}
	} else if (b.type === 'product') {
		return expression_lcm_two(exp2, exp1);
	} else if (a.type === 'exponent' && a.power.node.type === 'numeral') {
		if (b.type === 'exponent' && b.power.node.type === 'numeral') {
			if (a.base._to_lexical_string() === b.base._to_lexical_string()) {
				return new Expression([
					a.base,
					'^',
					Numeral.max(a.power.node, b.power.node),
				]);
			}
			return new Expression([exp1, exp2]).simplify();
		} else {
			if (a.base._to_lexical_string() === b._to_lexical_string()) {
				return a.power.valueOf() >= 1 ? exp1.clone() : exp2.clone();
			}
			return new Expression([exp1, exp2]).simplify();
		}
	} else if (b.type === 'exponent' && b.power.node.type === 'numeral') {
		return expression_lcm_two(exp2, exp1);
	} else if (a.type === 'numeral') {
		if (b.type === 'numeral') {
			return new Expression(Numeral.lcm(a, b));
		}
		return new Expression([a, exp2]).simplify();
	} else if (b.type === 'numeral') {
		return expression_lcm_two(exp2, exp1);
	} else {
		if (exp1._to_lexical_string() === exp2._to_lexical_string()) {
			return exp1;
		}
		return new Expression([exp1, exp2]).simplify();
	}
}
