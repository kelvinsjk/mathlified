import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';
import {
	Expression,
	Numeral,
	Variable,
	Exponent,
	Product,
	Sum,
	shorthandToExpression,
	quotient,
	sum,
} from '../expression/expression.js';
/** @typedef {import('../expression/expression.js').ExpressionNode} ExpressionNode */
/** @typedef {import('../expression/expression.js').Shorthand} Shorthand */

/** The GeneralPolynomial class is a single-variable polynomial with coefficients that are arbitrary expression */
export class Polynomial extends Expression {
	/** @type {ExpressionNode[]} coeffs in ascending order */
	coeffs;
	/** @type {string|Variable} */
	variable;
	// TODO: implement getters/setters for variables (via replaceWith method?)
	/** @type {boolean} */
	_ascending;

	/**
	 * @param {Shorthand[]|string} coeffs
	 * @param { {ascending?: boolean, variable?: string|Variable} } [options] - defaults to ascending polynomial with variable 'x'
	 * WARNING: do ensure that the coefficients are free of the variable. we currently do not check for this.
	 */
	constructor(coeffs, options) {
		// simplify coeffs
		let name = options?.variable ?? 'x';
		if (typeof coeffs === 'string') {
			name = coeffs;
			coeffs = options?.ascending ? [0, 1] : [1, 0];
		}
		const coeffsNode = coeffs.map((coeff) => {
			return shorthandToExpression(coeff).simplify().node;
		});
		if (!options?.ascending) coeffsNode.reverse();
		// remove trailing zeros
		while (
			coeffsNode.length > 1 &&
			coeffsNode[coeffsNode.length - 1] instanceof Numeral &&
			/** @type {Numeral} */ (coeffsNode[coeffsNode.length - 1]).is.zero()
		) {
			coeffsNode.pop();
		}
		// construct terms
		const x = new Expression(
			name instanceof Variable ? name : new Variable(name),
		);
		const terms = coeffsNode
			.map((coeff, i) => {
				return i === 0
					? coeff
					: i === 1
						? new Product(new Expression(coeff), x)
						: new Product(
								new Expression(coeff),
								new Expression(new Exponent(x, new Expression(i))),
							);
			})
			.map((term) => new Expression(term).simplify());
		if (!options?.ascending) terms.reverse();
		const sumExp = new Expression(new Sum(...terms)).simplify();
		super(sumExp.node);
		this.simplify();
		this.coeffs = coeffsNode;
		this.variable = name;
		this._ascending = options?.ascending ?? false;
	}

	get degree() {
		return this.coeffs.length - 1;
	}
	get options() {
		return {
			ascending: this._ascending,
			variable: this.variable,
		};
	}

	/**
	 * @param {boolean} asc
	 */
	set ascending(asc) {
		if (this._ascending !== asc) {
			// there might be only 1 term so expression is not a sum
			try {
				this._getSumTerms().reverse();
			} catch {
				// not a sum: so rearranging terms unnecessary
			}
		}
		this._ascending = asc;
	}

	// * Arithmetic methods
	/**
	 * @returns {Polynomial}
	 */
	negative() {
		return new_poly_from_ascending_coeffs(
			this.coeffs.map((x) => new Expression(x).negative().node),
			this.options,
		);
	}
	/**
	 * @overload
	 * @param {number|Polynomial} p2
	 * @returns {Polynomial}
	 */
	/**
	 * @overload
	 * @param {Expression} p2
	 * @returns {Expression}
	 */
	/**
	 * @param {number|Polynomial|Expression} p2
	 * @returns {Polynomial|Expression}
	 */
	plus(p2) {
		if (typeof p2 !== 'number' && !(p2 instanceof Polynomial)) {
			try {
				const poly2 = expressionToPolynomial(p2, this.variable);
				return this.plus(poly2);
			} catch {
				return new Expression(this.node).plus(p2);
			}
		}
		const poly2 =
			typeof p2 === 'number'
				? new Polynomial([new Numeral(p2)], this.options)
				: p2;
		if (
			this.variable !== poly2.variable &&
			this.degree !== 0 &&
			poly2.degree !== 0
		)
			throw new Error(
				`variables do not match, ${this.variable.toString()}, ${poly2.variable.toString()}, ${this.degree}, ${poly2.degree} ${this.toString()}`,
			);
		let coeffs = pad_zeros(this.coeffs, poly2.degree + 1);
		coeffs = coeffs.map(
			(x, i) => new Expression(x).plus(poly2.coeffs[i] ?? new Numeral(0)).node,
		);
		return new_poly_from_ascending_coeffs(coeffs, this.options);
	}
	/**
	 *
	 * @param {number|Polynomial} p2
	 * @returns {Polynomial}
	 */
	minus(p2) {
		p2 =
			typeof p2 === 'number'
				? new Polynomial([new Numeral(p2)], this.options)
				: p2;
		return this.plus(p2.negative());
	}
	/**
	 * @param {number|Numeral|Polynomial} p2 - Expression must be a numeral
	 * @returns {Polynomial}
	 */
	times(p2) {
		const poly2 =
			p2 instanceof Polynomial ? p2 : new Polynomial([p2], this.options);
		if (this.variable !== poly2.variable)
			throw new Error('variables do not match');
		const degree = this.degree + poly2.degree;
		const coeffs = create_zero_exp_array(degree + 1);
		for (let i = 0; i <= this.degree; i++) {
			for (let j = 0; j <= poly2.degree; j++) {
				coeffs[i + j] = /** @type {Expression} */ (coeffs[i + j]).plus(
					new Expression(/** @type {ExpressionNode} */ (this.coeffs[i])).times(
						/** @type {ExpressionNode} */ (poly2.coeffs[j]),
					),
				);
			}
		}
		const x = new_poly_from_ascending_coeffs(
			coeffs.map((x) => x.node),
			this.options,
		);
		return x;
	}
	/**
	 * @returns {Polynomial}
	 */
	square() {
		return this.times(this);
	}
	/**
	 * divides the polynomial by a number
	 * @param {number|Numeral} num
	 * @returns {Polynomial}
	 */
	divide(num) {
		const numeral = num instanceof Numeral ? num : new Numeral(num);
		return this.times(numeral.reciprocal());
	}

	factorize = {
		/**
		 * @param {{forcePositiveLeadingCoefficient?: boolean, verbatim?: boolean|'quotient'}} [options]
		 * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
		 */
		commonFactor: (options) => {
			let power = 0;
			for (const coeff of this.coeffs) {
				if (coeff.type !== 'numeral')
					throw new Error(
						'Non-numeral coefficients not supported at the moment',
					);
				if (!coeff.is.zero()) break;
				power++;
			}

			const negative =
				/** @type {Numeral[]} */ (this.coeffs).every((x) => !x.is.positive()) &&
				/** @type {Numeral[]} */ (this.coeffs).some((x) => x.is.negative());
			let gcd = Numeral.gcd(.../** @type {Numeral[]} */ (this.coeffs));
			if (
				negative ||
				(options?.forcePositiveLeadingCoefficient &&
					/** @type {Numeral} */ (this.leadingCoefficient).is.negative())
			)
				gcd = gcd.negative();
			const commonFactorCoeffs = pad_zeros([gcd], power + 1);
			commonFactorCoeffs.reverse();
			const commonFactor = new_poly_from_ascending_coeffs(
				commonFactorCoeffs,
				this.options,
			);
			const remainingCoeffs = /** @type {Numeral[]} */ (this.coeffs)
				.slice(power)
				.map((x) => x.divide(gcd));
			const remainingFactor = new_poly_from_ascending_coeffs(
				remainingCoeffs,
				this.options,
			);
			/** @type {Expression & {commonFactor?: Polynomial, remainingFactor?: Polynomial}} */
			const expression = new Expression(
				new Product(commonFactor, remainingFactor),
			).simplify();
			expression.commonFactor = commonFactor;
			expression.remainingFactor = remainingFactor;
			return /** @type {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}} */ (
				expression
			);
		},
		/**
		 * returns factorized expression of the form k(ax-b)(cx-d) where a,b,c,d \in \mathbb{Z} and gcd(a,b)=gcd(c,d)=1 and d=0 or b/a < d/c. if equal roots, will return k(ax-b)^2
		 * special exception: expressions like 4-x^2 factorize to (2+x)(2-x) rather than -(x+2)(x-2)
		 * @returns {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}}
		 */
		quadratic: () => {
			const [root1, root2] = this.solve.quadratic();
			const [x1, x2] = [root1._getNumeral(), root2._getNumeral()];
			const x1Num = x1.number.num;
			const x1Den = x1.number.den;
			const x2Num = x2.number.num;
			const x2Den = x2.number.den;
			let factor1 = new Polynomial([new Numeral(x1Den), new Numeral(-x1Num)], {
				variable: this.variable,
			});
			let factor2 = new Polynomial([new Numeral(x2Den), new Numeral(-x2Num)], {
				variable: this.variable,
			});
			const leadingCoefficient = /** @type {Numeral} */ (
				this.coeffs[this.coeffs.length - 1]
			);
			let multiple = leadingCoefficient.divide(x1Den).divide(x2Den);
			// special exception for expressions like 4-x^2
			if (
				this._ascending &&
				/** @type {Numeral} */ (this.coeffs[1]).is.zero() &&
				leadingCoefficient.is.negative() &&
				/** @type {Numeral} */ (this.coeffs[0]).is.positive()
			) {
				multiple = multiple.negative();
				factor2 = factor2.negative();
				factor1.ascending = true;
				factor2.ascending = true;
			}
			// handling ascending expressions
			if (this._ascending && x1.is.equalTo(x2)) {
				factor1.ascending = true;
				if (/** @type {Numeral} */ (factor1.coeffs[0]).is.negative())
					factor1 = factor1.negative();
			}
			/** @type {Expression & {factors?: [Polynomial, Polynomial], multiple?: Numeral}} */
			const expression = x1.is.equalTo(x2)
				? new Expression(
						new Product(
							new Expression(multiple),
							new Expression(new Exponent(factor1, new Expression(2))),
						),
					)
				: new Expression(
						new Product(new Expression(multiple), factor1, factor2),
					);
			expression.factors = [factor1, factor2];
			expression.multiple = multiple;
			return /** @type {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}} */ (
				expression
			);
		},
	};

	solve = {
		/**
		 * @param {number|Polynomial|Expression} [rhs=0] - if in Expression type, only support Numerals
		 * @returns {Expression}
		 */
		linear: (rhs = 0) => {
			const rhsCoerced =
				rhs instanceof Expression && !(rhs instanceof Polynomial)
					? new Polynomial([rhs._getNumeral()], this.options)
					: rhs;
			const lhs = this.minus(rhsCoerced);
			if (lhs.degree !== 1)
				throw new Error(
					`Nonlinear polynomial ${this.toString()}=${rhs.toString()} received`,
				);
			const [b, a] = /** @type {[Numeral, Numeral]} */ (lhs.coeffs);
			return new Expression(b.negative().divide(a));
		},
		/**
		 *
		 * @param {number|Polynomial} [rhs=0]
		 * @returns {[Expression, Expression, 'rational']} such that either root1 = 0 or root1 \leq root2
		 * TODO: allow options to modify output types
		 * TODO: ensure integer discriminant
		 */
		quadratic: (rhs = 0) => {
			// TODO: throw if non-numerals
			const lhs = this.minus(rhs);
			if (lhs.coeffs.some((x) => x.type !== 'numeral')) {
				throw new Error(
					`Non-numeral coefficients not yet supported for quadratic solving`,
				);
			}
			const gcd = Numeral.gcd(.../**@type {Numeral[]}*/ (lhs.coeffs));
			const integralPoly = new Polynomial(
				/**@type {Numeral[]}*/ (lhs.coeffs).map((x) => x.divide(gcd)),
				{ ascending: true },
			);
			const discriminant = integralPoly.quadraticDiscriminant()._getNumeral();
			if (discriminant.is.negative())
				throw new Error(`Complex solutions not yet supported`);
			const radical = Math.sqrt(discriminant.valueOf());
			if (!Number.isInteger(radical))
				throw new Error(`Irrational solutions not yet supported`);
			const [, b, a] = /** @type {[Numeral, Numeral, Numeral]} */ (
				integralPoly.coeffs
			);
			let root1 = b.negative().minus(radical).divide(a.times(2));
			let root2 = b.negative().plus(radical).divide(a.times(2));
			if (root1.valueOf() > root2.valueOf() || root2.is.zero()) {
				[root1, root2] = [root2, root1];
			}
			return [new Expression(root1), new Expression(root2), 'rational'];
		},
	};

	/**
	 * @param {number|Numeral} x
	 * @returns {Numeral}
	 */
	evaluate(x) {
		const scope = {
			[typeof this.variable === 'string' ? this.variable : this.variable.name]:
				x,
		};
		return this.subIn(scope)._getNumeral();
	}

	/** @returns {Expression} */
	quadraticDiscriminant() {
		if (this.degree !== 2)
			throw new Error(
				`Cannot find quadratic discriminant for non-quadratic ${this.toString()}`,
			);
		const [c, b, a] = /** @type {[Expression, Expression, Expression]} */ (
			this.coeffs.map((x) => new Expression(x.clone()))
		);
		return new Expression(
			new Sum(
				new Expression(new Product(b, b)),
				new Expression(new Product(new Expression(-4), a, c)),
			),
		).simplify();
	}

	/**
	 *
	 * @param {number} n
	 * @param {{coeff?: number|Numeral|Expression, ascending?: boolean, variable?: string|Variable}} [options] coeff defaults to 1
	 * @returns {Polynomial}
	 */
	static ofDegree(n, options) {
		const coeff = options?.coeff ?? 1;
		/** @type {(Numeral|number|Expression)[]} */
		const zeros = n === 0 ? [] : create_zero_array(n);
		const coeffs = options?.ascending ? [...zeros, coeff] : [coeff, ...zeros];
		return new Polynomial(coeffs, options);
	}

	/** @returns {ExpressionNode} */
	get leadingCoefficient() {
		return /** @type {ExpressionNode} */ (this.coeffs[this.coeffs.length - 1]);
	}
	/** @returns {ExpressionNode} */
	get constantTerm() {
		return /** @type {ExpressionNode} */ (this.coeffs[0]);
	}
	/** @returns {Polynomial} */
	clone() {
		const p = new_poly_from_ascending_coeffs(
			this.coeffs.map((x) => x.clone()),
			this.options,
		);
		return p;
	}
	/**
	 *
	 * @param {number|Numeral|Expression|[number,number]} root
	 * @param {{variable?: string}} [options] coeff defaults to 1
	 */
	static fromRoot(root, options) {
		const rootNumeral = (
			typeof root === 'number'
				? new Numeral(root)
				: root instanceof Numeral
					? root
					: Array.isArray(root)
						? new Numeral(root)
						: root._getNumeral()
		).simplify();
		const num = rootNumeral.number.num;
		const den = rootNumeral.number.den;
		return new Polynomial([den, -num], options);
	}
	/**
	 * @param {Polynomial} divisor
	 * @returns {{quotient: Polynomial, remainder: Polynomial, result: Expression}}
	 */
	longDivide(divisor) {
		const { quotient, remainder } = longDivide(this, divisor);
		return {
			quotient,
			remainder,
			result: sum(quotient, [remainder, '/', divisor]),
		};
	}
}

/**
 * pad zeros to the end of the array (returning itself if n is less)
 * @param {ExpressionNode[]} arr
 * @param {number} n - final length of the array
 * @returns {ExpressionNode[]}
 */
function pad_zeros(arr, n) {
	if (arr.length >= n) return arr;
	return arr.map((x) => x.clone()).concat(create_zero_array(n - arr.length));
}
/**
 *
 * @param {number} n
 * @returns {Numeral[]}
 */
function create_zero_array(n) {
	return new Array(n).fill(new Numeral(0));
}
/**
 *
 * @param {number} n
 * @returns {Expression[]}
 */
function create_zero_exp_array(n) {
	return new Array(n).fill(new Expression(0));
}

/**
 * @param {ExpressionNode[]} coeffs
 * @param {{variable: string|Variable, ascending: boolean}} options
 * @returns {Polynomial}
 */
function new_poly_from_ascending_coeffs(coeffs, options) {
	const p = new Polynomial(coeffs, { ...options, ascending: true });
	p.ascending = options.ascending;
	return p;
}

/**
 * given p(x)/d(x),
 * @param {Polynomial} poly
 * @param {Polynomial} divisor
 * @param {Polynomial} [carryOver]
 * @returns {{quotient: Polynomial, remainder: Polynomial}}
 */
function longDivide(poly, divisor, carryOver) {
	carryOver =
		carryOver ??
		new Polynomial([0], { ascending: poly.ascending, variable: poly.variable });
	if (divisor.degree === 0) {
		throw new Error(`Divisor ${divisor.toString()} must have degree > 0`);
	}
	if (poly.degree < divisor.degree) {
		return { quotient: carryOver, remainder: poly };
	}
	const a = poly.leadingCoefficient;
	const b = divisor.leadingCoefficient;
	const coeff = quotient(a, b);
	return longDivide(
		poly.minus(
			divisor.times(
				Polynomial.ofDegree(poly.degree - divisor.degree, {
					variable: poly.variable,
					coeff,
				}),
			),
		),
		divisor,
		carryOver.plus(
			Polynomial.ofDegree(poly.degree - divisor.degree, {
				coeff,
				variable: poly.variable,
			}),
		),
	);
}
