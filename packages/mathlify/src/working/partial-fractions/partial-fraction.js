import { Expression, Numeral } from '../../core/expression/expression.js';
import { Polynomial } from '../../core/polynomial/polynomial.js';
import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';
import { Equation } from '../equation/equation.js';
import { solve } from '../equation/equation-working.js';
/**
 * @param {Polynomial|number} num
 * @param {(Polynomial|Expression)[]|Polynomial|Expression} linearFactors - linear factors of the denominator
 * @param {Polynomial|[Polynomial, 2]} [quadraticFactor] - either a perfect square or an irreducible quadratic factor in the denominator
 * @returns {{ working: string, answer: Expression, partialFractions: Expression[] }}
 */
export function partialFractions(num, linearFactors, quadraticFactor) {
	linearFactors = Array.isArray(linearFactors)
		? linearFactors
		: [linearFactors];
	const linearPolys = linearFactors.map((x) =>
		x instanceof Polynomial ? x : expressionToPolynomial(x),
	);
	const variable = linearPolys[0]?.variable ?? 'x';
	const numerator =
		typeof num === 'number' ? new Polynomial([num], { variable }) : num;
	let charCode = 64;
	/** @type {Expression[]} */
	const fractions = [];
	/** @type {Expression[]} */
	let terms = [];
	// set up
	let denString = '';
	for (const [i, factor] of linearPolys.entries()) {
		const unknown = String.fromCharCode(++charCode);
		fractions.push(new Expression([unknown, '/', factor]));
		denString +=
			factor.node.type === 'sum' ? `\\left( ${factor} \\right)` : `${factor}`;
		terms.push(
			new Expression([unknown, ...linearPolys.filter((_, j) => i !== j)]),
		);
	}
	let A = '';
	let B = '';
	if (quadraticFactor) {
		if (Array.isArray(quadraticFactor)) {
			const [factor] = quadraticFactor;
			denString +=
				factor.node.type === 'sum'
					? `\\left( ${factor} \\right)^2`
					: `${factor}^2`;
			A = String.fromCharCode(++charCode);
			B = String.fromCharCode(++charCode);
			fractions.push(new Expression([A, '/', factor]));
			fractions.push(new Expression([B, '/', [factor, '^', 2]]));
			terms = terms.map((term) => term.times([factor, '^', 2]));
			terms.push(new Expression([A, ...linearPolys, factor]));
			terms.push(new Expression([B, ...linearPolys]));
		} else {
			denString += `\\left( ${quadraticFactor} \\right)`;
			A = String.fromCharCode(++charCode);
			B = String.fromCharCode(++charCode);
			const linear = new Polynomial([A, B], { variable });
			fractions.push(new Expression([linear, '/', quadraticFactor]));
			terms = terms.map((term) => term.times(quadraticFactor));
			terms.push(new Expression([linear, ...linearPolys]));
		}
	}
	const originalFraction = `\\frac{${num}}{${denString}}`;
	let working = `${originalFraction} = ${new Expression(['+', ...fractions])}`;
	working += `\n\t\\\\ ${num} = ${new Expression(['+', ...terms])}`;

	// solve for unknowns
	charCode = 64;
	/** @type {Expression[]} */
	const partialFractions = [];
	/** @type {Numeral[]} */
	const leadingCoeffs = [];
	/** @type {Numeral[]} */
	const constantTerms = [];
	/** @type {Numeral[]} */
	const unknownValues = [];
	for (const [i, factor] of linearPolys.entries()) {
		const root = factor.solve.linear()._getNumeral();
		working += `\n\t\\\\ \\text{When } ${variable} = ${root},`;
		const lhs = numerator.evaluate(root);
		let coeff = linearPolys
			.filter((_, j) => i !== j)
			.reduce((a, b) => a.times(b.evaluate(root)), new Numeral(1));
		let leadingCoeff = linearPolys
			.filter((_, j) => i !== j)
			.reduce(
				(a, b) => a.times(/**@type{Numeral}*/ (b.leadingCoefficient)),
				new Numeral(1),
			);
		let constantTerm = linearPolys
			.filter((_, j) => i !== j)
			.reduce(
				(a, b) => a.times(/**@type{Numeral}*/ (b.constantTerm)),
				new Numeral(1),
			);
		if (quadraticFactor) {
			if (Array.isArray(quadraticFactor)) {
				const [factor] = quadraticFactor;
				coeff = coeff.times(factor.evaluate(root).square());
			} else {
				coeff = coeff.times(quadraticFactor.evaluate(root));
				leadingCoeff = leadingCoeff.times(
					/**@type{Numeral}*/ (quadraticFactor.leadingCoefficient),
				);
				constantTerm = constantTerm.times(
					/**@type{Numeral}*/ (quadraticFactor.constantTerm),
				);
			}
		}
		leadingCoeffs.push(leadingCoeff);
		constantTerms.push(constantTerm);
		const unknown = String.fromCharCode(++charCode);
		const rhs = new Expression([coeff, unknown]);
		working += `\n\t\\\\ ${lhs} = ${rhs}`;
		const unknownValue = lhs.divide(coeff);
		unknownValues.push(unknownValue);
		partialFractions.push(new Expression([unknownValue, '/', factor]));
		if (!coeff.is.one()) working += `\n\t\\\\ ${unknown} = ${unknownValue}`;
	}
	if (quadraticFactor) {
		const degree = linearFactors.length + 2;
		if (Array.isArray(quadraticFactor)) {
			const [factor] = quadraticFactor;
			const root = factor.solve.linear()._getNumeral();
			working += `\n\t\\\\ \\text{When } ${variable} = ${root},`;
			const lhs = numerator.evaluate(root);
			let coeff = linearPolys.reduce(
				(a, b) => a.times(b.evaluate(root)),
				new Numeral(1),
			);
			const rhs = new Expression([coeff, B]);
			working += `\n\t\\\\ ${lhs} = ${rhs}`;
			const BVal = lhs.divide(coeff);
			if (!coeff.is.one()) working += `\n\t\\\\ ${B} = ${BVal}`;
			working += `\n\t\\\\ \\text{Comparing coefficients,}`;
			const xTerm = new Expression([variable, '^', degree - 1]);
			const otherTerms1 = unknownValues.map(
				(x, i) =>
					new Expression([x, /** @type {Numeral} */ (leadingCoeffs[i])]),
			);
			const leadingCoefficient = linearPolys.reduce(
				(a, b) => a.times(/**@type{Numeral}*/ (b.leadingCoefficient)),
				new Numeral(1),
			);
			const lhs1 = numerator.coeffs[degree - 1];
			const rhs1 = new Expression([
				'+',
				...otherTerms1,
				[leadingCoefficient, A],
			]);
			const { root: AVal } = solve.linear(new Equation(rhs1, lhs1), A);
			working += `\n\t\\\\ ${xTerm}: \\quad ${lhs1} = ${rhs1}`;
			working += `\n\t\\\\ ${A} = ${AVal}`;
			partialFractions.push(new Expression([AVal, '/', factor]));
			partialFractions.push(new Expression([BVal, '/', [factor, '^', 2]]));
		} else {
			working += `\n\t\\\\ \\text{Comparing coefficients,}`;
			const xTerm = new Expression([variable, '^', degree - 1]);
			const otherTerms1 = unknownValues.map(
				(x, i) =>
					new Expression([x, /** @type {Numeral} */ (leadingCoeffs[i])]),
			);
			const leadingCoefficient = linearPolys.reduce(
				(a, b) => a.times(/**@type{Numeral}*/ (b.leadingCoefficient)),
				new Numeral(1),
			);
			const lhs1 = numerator.coeffs[degree - 1] ?? new Numeral(0);
			const rhs1 = new Expression([
				'+',
				...otherTerms1,
				[leadingCoefficient, A],
			]);
			const { root: AVal } = solve.linear(new Equation(rhs1, lhs1), A);
			working += `\n\t\\\\ ${xTerm}: \\quad ${lhs1} = ${rhs1}`;
			working += `\n\t\\\\ ${A} = ${AVal}`;
			const lhs2 = numerator.constantTerm;
			const otherTerms2 = unknownValues.map(
				(x, i) =>
					new Expression([x, /** @type {Numeral} */ (constantTerms[i])]),
			);
			const constantTerm = linearPolys.reduce(
				(a, b) => a.times(/**@type{Numeral}*/ (b.constantTerm)),
				new Numeral(1),
			);
			const rhs2 = new Expression(['+', ...otherTerms2, [constantTerm, B]]);
			const { root: BVal } = solve.linear(new Equation(rhs2, lhs2), B);
			working += `\n\t\\\\ ${variable}^0: \\quad ${lhs2} = ${rhs2}`;
			working += `\n\t\\\\ ${B} = ${BVal}`;
			const num = new Polynomial([AVal, BVal], { variable });
			partialFractions.push(new Expression([num, '/', quadraticFactor]));
		}
	}
	const answer = new Expression(['+', ...partialFractions]).simplify();
	working += `\n\t\\\\ ${originalFraction} = ${answer} `;

	return { working, answer, partialFractions };
}
