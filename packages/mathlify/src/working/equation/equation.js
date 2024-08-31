import {
	shorthandToExpression,
	e,
	Fn,
} from '../../core/expression/expression.js';
/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').ExpressionNode} ExpressionNode */
import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';
import {
	Expression,
	Quotient,
	Product,
	Sum,
} from '../../core/expression/expression.js';
import { implicitlyDifferentiate } from '../../calculus/implicit-differentiation.js';
import { Logarithm, logTerm } from '../../fns/index.js';

/** @typedef {'='|'>'|'>='|'<'|'<='|'!='} Sign */

/**
 * The `Equation` class handles two expressions on either side of an equation
 */
export class Equation {
	/** @type {Expression} the expression on the left*/
	lhs;
	/** @type {Expression} the expression on the right*/
	rhs;
	/** @type {Sign} */
	sign;
	/** @type {boolean} */
	aligned;

	/**
	 * Creates an Equation
	 * @param {Shorthand} lhs - the initial expression on the left
	 * @param {Shorthand} [rhs=0] - the initial expression on the right
	 * @param {{aligned?: boolean, sign?: Sign }} [options] - aligned: true adds the & before =. Defaults to false
	 */
	constructor(lhs, rhs = 0, options) {
		this.lhs = lhs instanceof Expression ? lhs : shorthandToExpression(lhs);
		this.rhs = rhs instanceof Expression ? rhs : shorthandToExpression(rhs);
		this.aligned = options?.aligned ?? false;
		this.sign = options?.sign ?? '=';
	}

	/** @returns {'equation'|'inequality'} */
	get type() {
		return this.sign === '=' ? 'equation' : 'inequality';
	}

	/**
	 * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
	 * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after substitution
	 * @returns {Equation}
	 */
	subIn(scope, options) {
		return new Equation(
			this.lhs.subIn(scope, options),
			this.rhs.subIn(scope, options),
			this.options,
		);
	}

	/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
	/**
	 * simplifies the equation: warning: mutates current equation
	 * @param {SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {Equation}
	 * */
	simplify(options) {
		return new Equation(
			this.lhs.simplify(options),
			this.rhs.simplify(options),
			this.options,
		);
	}

	/**
	 *
	 * @param {Shorthand} exp
	 * @returns {Equation}
	 */
	plus(exp) {
		return new Equation(this.lhs.plus(exp), this.rhs.plus(exp), this.options);
	}
	/**
	 *
	 * @param {Shorthand} exp
	 * @param {{verbatim?: boolean}} [options]
	 * @returns {Equation}
	 */
	minus(exp, options) {
		const eqn = new Equation(
			this.lhs.minus(exp),
			this.rhs.minus(exp),
			this.options,
		);
		return options?.verbatim ? eqn : eqn.simplify();
	}
	/**
	 *
	 * @param {Shorthand} exp
	 * @param {{verbatim?: boolean, expand?: boolean}} [options]
	 * @returns {Equation}
	 */
	times(exp, options) {
		const expression = shorthandToExpression(exp).simplify();
		const sign =
			expression.node.type === 'numeral' && expression.node.is.negative()
				? switchInequalitySign(this.sign)
				: this.sign;
		return new Equation(
			this.lhs.times(exp, options),
			this.rhs.times(exp, options),
			{ aligned: this.aligned, sign },
		);
	}
	/**
	 *
	 * @param {{verbatim?: boolean, expand?: boolean}} [options]
	 * @returns {Equation}
	 */
	square(options) {
		return new Equation(
			this.lhs.square(options),
			this.rhs.square(options),
			this.options,
		);
	}
	/**
	 * @param {Shorthand} n
	 * @param {SimplifyOptions} [options]
	 * @returns {Equation}
	 */
	pow(n, options) {
		return new Equation(
			this.lhs.pow(n, options),
			this.rhs.pow(n, options),
			this.options,
		);
	}
	/**
	 *
	 * @param {Shorthand} exp
	 * @returns {Equation}
	 */
	divide(exp) {
		const expression = shorthandToExpression(exp).simplify();
		const sign =
			expression.node.type === 'numeral' && expression.node.is.negative()
				? switchInequalitySign(this.sign)
				: this.sign;
		return new Equation(this.lhs.divide(exp), this.rhs.divide(exp), {
			aligned: this.aligned,
			sign,
		});
	}
	/**
	 * @param {Shorthand} exp
	 * @returns {Equation}
	 * WARNING: does not handle sign changes
	 */
	divideByFactor(exp) {
		return new Equation(
			this.lhs._divide_by_factor(exp),
			this.rhs._divide_by_factor(exp),
			this.options,
		);
	}

	/**
	 * @param {import('../../core/expression/expression.js').ExpansionOptions} [options]
	 * @returns {Equation}
	 */
	expand(options) {
		return new Equation(
			this.lhs.expand(options),
			this.rhs.expand(options),
			this.options,
		);
	}

	/**
	 * @returns {Equation}
	 */
	removeLogarithm() {
		// TODO: handle different bases
		// TODO: verbatim vs simplify
		const lhs = this.lhs;
		const rhs = this.rhs;
		if (!(lhs.node instanceof Logarithm))
			throw new Error('lhs is not a logarithm');
		return new Equation(
			lhs.node.argument.clone(),
			rhs.node instanceof Logarithm
				? rhs.node.argument.clone()
				: new Expression([e, '^', rhs]).simplify(),
			this.options,
		);
	}

	/**
	 * @param {string} [variable='x']
	 */
	differentiate(variable = 'x') {
		return new Equation(
			implicitlyDifferentiate(this.lhs, variable),
			implicitlyDifferentiate(this.rhs, variable),
			this.options,
		);
	}

	/**
	 * @param {{target?: 'l'|'r'|'b'}} [options] default to the left
	 * @returns {Equation}
	 */
	toPolynomial(options) {
		const left = !(options?.target === 'r');
		const right = options?.target === 'r' || options?.target === 'b';
		return new Equation(
			left ? expressionToPolynomial(this.lhs) : this.lhs,
			right ? expressionToPolynomial(this.rhs) : this.rhs,
			this.options,
		);
	}

	/**
	 * @param {string} [variable='x']
	 * @returns {Equation}
	 */
	toGeneralPolynomial(variable = 'x') {
		return new Equation(
			expressionToPolynomial(this.lhs, variable),
			this.rhs,
			this.options,
		);
	}

	/**
	 * for f(x), e^f(x) and ln(f(x)), apply inverses to get
	 * x = f^{-1}(y), f(x) = ln(y) and f(x) = e^y
	 * @returns {Equation}
	 */
	inverse() {
		const lhsNode = this.lhs.node;
		if (
			lhsNode.type === 'exponent' &&
			lhsNode.base.toString() === e.toString()
		) {
			return new Equation(
				lhsNode.power.clone(),
				logTerm(this.rhs.clone()),
				this.options,
			);
		} else if (lhsNode.type === 'fn') {
			if (lhsNode.functionName === 'logarithm') {
				return new Equation(
					lhsNode.argument.clone(),
					[e, '^', this.rhs.clone()],
					this.options,
				);
			}
			// TODO: throw for cases like abs/brackets/sqrt/trigo
			const f = lhsNode.functionName;
			return new Equation(
				lhsNode.argument.clone(),
				new Fn(this.rhs.clone(), { functionName: `${f}^{-1}` }),
			);
		}
		const rhsNode = this.rhs.node;
		if (
			rhsNode.type === 'exponent' &&
			rhsNode.base.toString() === e.toString()
		) {
			return new Equation(
				logTerm(this.lhs.clone()),
				rhsNode.power.clone(),
				this.options,
			);
		} else if (rhsNode.type === 'fn') {
			if (rhsNode.functionName === 'logarithm') {
				return new Equation(
					[e, '^', this.lhs.clone()],
					rhsNode.argument.clone(),
					this.options,
				);
			}
			// TODO: throw for cases like abs/brackets/sqrt/trigo
			const f = rhsNode.functionName;
			return new Equation(
				new Fn(this.lhs.clone(), { functionName: `${f}^{-1}` }),
				rhsNode.argument.clone(),
			);
		}
		throw new Error(
			`inverse only implemented for log, exp and fn at this moment`,
		);
	}

	factorize = {
		/**
		 * factorizes by taking out common factor
		 * @param {{targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
		 * @returns {Equation}
		 * */
		commonFactor: (options) => {
			if (options?.targetRight) {
				return new Equation(
					this.lhs.clone(),
					this.rhs.clone().factorize.commonFactor(options),
					this.options,
				);
			} else {
				return new Equation(
					this.lhs.clone().factorize.commonFactor(options),
					this.rhs.clone(),
					this.options,
				);
			}
		},
		/**
		 * @param {{targetRight?: boolean}} [options] - targets lhs by default
		 * @returns {Equation}
		 * */
		quadratic: (options) => {
			// TODO: handle errors
			const quadratic = options?.targetRight ? this.rhs : this.lhs;
			const poly = expressionToPolynomial(quadratic);
			return options?.targetRight
				? new Equation(
						this.lhs.clone(),
						poly.factorize.quadratic(),
						this.options,
					)
				: new Equation(
						poly.factorize.quadratic(),
						this.rhs.clone(),
						this.options,
					);
		},
		/**
		 * @param {'lhs'|'rhs'|{lhs: number[]}|{rhs: number[]}} target - lhs/rhs (quotient) or an array if the target is a sum
		 * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
		 * @returns {Equation}
		 * */
		denominator: (target, method = 'quadratic') => {
			//TODO: refactor
			if (target === 'lhs') {
				if (this.lhs.node.type !== 'quotient') {
					throw new Error('lhs must be a quotient for target lhs');
				}
				const den = this.lhs.node.den;
				const factorizedDen =
					method === 'quadratic'
						? expressionToPolynomial(den).factorize.quadratic()
						: den.factorize.commonFactor();
				return new Equation(
					new Expression(
						new Quotient(this.lhs.node.num.clone(), factorizedDen),
					),
					this.rhs.clone(),
					this.options,
				);
			} else if (target === 'rhs') {
				if (this.rhs.node.type !== 'quotient') {
					throw new Error('rhs must be a quotient for target rhs');
				}
				const den = this.rhs.node.den;
				const factorizedDen =
					method === 'quadratic'
						? expressionToPolynomial(den).factorize.quadratic()
						: den.factorize.commonFactor();
				return new Equation(
					this.lhs.clone(),
					new Expression(
						new Quotient(this.rhs.node.num.clone(), factorizedDen),
					),
					this.options,
				);
			} else if ('lhs' in target) {
				if (this.lhs.node.type !== 'sum') {
					throw new Error('lhs must be a sum for target lhs');
				}
				const terms = this.lhs.node.terms.map((term, i) => {
					if (!target.lhs.includes(i)) return term.clone();
					let quotient = term.node;
					let negative = false;
					if (
						term.node.type === 'product' &&
						term.node.coeff.is.negative_one() &&
						term.node.factors.length === 1
					) {
						quotient = /** @type {Expression} */ (term.node.factors[0]).node;
						negative = true;
					}
					if (quotient.type !== 'quotient') {
						throw new Error('lhs must be a quotient for target lhs');
					}
					const den = quotient.den;
					const factorizedDen =
						method === 'quadratic'
							? expressionToPolynomial(den).factorize.quadratic()
							: den.factorize.commonFactor();
					const q = new Expression(
						new Quotient(quotient.num.clone(), factorizedDen),
					);
					return negative
						? new Expression(new Product(new Expression(-1), q))
						: q;
				});
				return new Equation(
					new Expression(new Sum(...terms)),
					this.rhs.clone(),
					this.options,
				);
			}
			// rhs
			if (this.rhs.node.type !== 'sum') {
				throw new Error('rhs must be a sum for target lhs');
			}
			const terms = this.rhs.node.terms.map((term, i) => {
				if (!target.rhs.includes(i)) return term.clone();
				let quotient = term.node;
				let negative = false;
				if (
					term.node.type === 'product' &&
					term.node.coeff.is.negative_one() &&
					term.node.factors.length === 1
				) {
					quotient = /** @type {Expression} */ (term.node.factors[0]).node;
					negative = true;
				}
				if (quotient.type !== 'quotient') {
					throw new Error('lhs must be a quotient for target lhs');
				}
				const den = quotient.den;
				const factorizedDen =
					method === 'quadratic'
						? expressionToPolynomial(den).factorize.quadratic()
						: den.factorize.commonFactor();
				const q = new Expression(
					new Quotient(quotient.num.clone(), factorizedDen),
				);
				return negative
					? new Expression(new Product(new Expression(-1), q))
					: q;
			});
			return new Equation(
				this.lhs.clone(),
				new Expression(new Sum(...terms)),
				this.options,
			);
		},
		/**
		 * @param {'lhs'|'rhs'} [target='lhs'] - lhs/rhs (quotient) or an array if the target is a sum
		 * @param {'commonFactor'|'quadratic'|'auto'} [_method='auto'] - auto method tries quadratic factorization, followed by common factor factorization
		 * @returns {Equation}
		 * */
		fraction: (target = 'lhs', _method = 'auto') => {
			//TODO: support methods
			const quotient = target === 'lhs' ? this.lhs : this.rhs;
			if (quotient.node.type !== 'quotient') {
				throw new Error('target must be a quotient');
			}
			const [num, den] = quotient._getQuotientTerms();
			let factorizedNum = num.factorize.commonFactor();
			let factorizedDen = den.factorize.commonFactor();
			try {
				const poly = expressionToPolynomial(den);
				factorizedDen = poly.factorize.quadratic();
			} finally {
			}
			try {
				const poly = expressionToPolynomial(num);
				factorizedNum = poly.factorize.quadratic();
			} finally {
			}
			return target === 'lhs'
				? new Equation(
						[factorizedNum, '/', factorizedDen],
						this.rhs.clone(),
						this.options,
					)
				: new Equation(
						this.lhs.clone(),
						[factorizedNum, '/', factorizedDen],
						this.options,
					);
		},
	};

	/**
	 * @param {number[]} order
	 * @param {{targetRight?: boolean}} [options]
	 * @returns {Equation}
	 */
	rearrange(order, options) {
		const lhs = options?.targetRight
			? this.lhs.clone()
			: this.lhs.rearrange(order);
		const rhs = options?.targetRight
			? this.rhs.rearrange(order)
			: this.rhs.clone();
		return new Equation(lhs, rhs, this.options);
	}

	/**
	 * @returns {Equation}
	 */
	positiveIndexNotation() {
		return new Equation(
			this.lhs.positiveIndexNotation(),
			this.rhs.positiveIndexNotation(),
			this.options,
		);
	}

	/**
	 * @returns {Equation}
	 */
	swapSides() {
		return new Equation(this.rhs.clone(), this.lhs.clone(), {
			aligned: this.aligned,
			sign: switchInequalitySign(this.sign),
		});
	}

	/**
	 * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
	 * @returns {Equation}
	 */
	crossMultiply(options) {
		let lhs = this.lhs.clone();
		// changes k (f(x) / g(x)) product into (kf(x)) / g(x). This is necessary for negative quotients in a sum
		if (
			lhs.node.type === 'product' &&
			lhs.node.factors.length === 1 &&
			/** @type {Expression} */ (lhs.node.factors[0]).node.type === 'quotient'
		) {
			lhs = new Expression(
				new Quotient(
					new Expression(
						new Product(
							lhs.node.coeff,
							/** @type {Expression} */ (lhs.node.factors[0]).node.num,
						),
					).expand(),
					/** @type {Expression} */ (lhs.node.factors[0]).node.den,
				),
			);
		}
		let rhs = this.rhs.clone();
		if (
			rhs.node.type === 'product' &&
			rhs.node.factors.length === 1 &&
			/** @type {Expression} */ (rhs.node.factors[0]).node.type === 'quotient'
		) {
			rhs = new Expression(
				new Quotient(
					new Expression(
						new Product(
							rhs.node.coeff,
							/** @type {Expression} */ (rhs.node.factors[0]).node.num,
						),
					).expand(),
					/** @type {Expression} */ (rhs.node.factors[0]).node.den,
				),
			);
		}
		const leftNum =
			lhs.node.type === 'quotient'
				? lhs._getQuotientTerms()[0].clone()
				: lhs.node.type === 'numeral'
					? new Expression(lhs._getNumeral().number.num)
					: lhs;
		const leftDen =
			lhs.node.type === 'quotient'
				? lhs._getQuotientTerms()[1].clone()
				: lhs.node.type === 'numeral'
					? lhs._getNumeral().number.den
					: 1;
		const rightNum =
			rhs.node.type === 'quotient'
				? rhs._getQuotientTerms()[0].clone()
				: rhs.node.type === 'numeral'
					? new Expression(rhs._getNumeral().number.num)
					: rhs;
		const rightDen =
			rhs.node.type === 'quotient'
				? rhs._getQuotientTerms()[1]
				: rhs.node.type === 'numeral'
					? rhs._getNumeral().number.den
					: 1;
		if (
			(leftDen === 1 ||
				(typeof leftDen !== 'number' &&
					leftDen.node.type === 'numeral' &&
					leftDen.node.is.one())) &&
			(rightDen === 1 ||
				(typeof rightDen !== 'number' &&
					rightDen.node.type === 'numeral' &&
					rightDen.node.is.one()))
		)
			return this;
		/** @type {[number|Expression, Expression]|Expression[]} */
		const lhsArgs =
			typeof rightDen === 'number' || rightDen.node.type === 'numeral'
				? [rightDen, leftNum]
				: [leftNum, rightDen];
		/** @type {[number|Expression, Expression]|Expression[]} */
		const rhsArgs =
			typeof leftDen === 'number' || leftDen.node.type === 'numeral'
				? [leftDen, rightNum]
				: [rightNum, leftDen];
		let sign = this.sign;
		if (
			(typeof leftDen === 'number' && leftDen < 0) ||
			(typeof leftDen !== 'number' &&
				(leftDen.node.type === 'numeral' || leftDen.node.type === 'product') &&
				leftDen.node.is.negative())
		)
			sign = switchInequalitySign(sign);
		if (
			(typeof rightDen === 'number' && rightDen < 0) ||
			(typeof rightDen !== 'number' &&
				(rightDen.node.type === 'numeral' ||
					rightDen.node.type === 'product') &&
				rightDen.node.is.negative())
		)
			sign = switchInequalitySign(sign);
		let eqn = new Equation(
			new Expression(new Product(...lhsArgs)),
			new Expression(new Product(...rhsArgs)),
			{ aligned: this.aligned, sign },
		);
		if (!options?.verbatim) eqn = eqn.simplify();
		return eqn;
	}

	get options() {
		return { aligned: this.aligned, sign: this.sign };
	}

	/**
	 * @return {string}
	 */
	toString() {
		const align = this.aligned ? `&` : ``;
		return `${this.lhs.toString()} ${align}${signToLaTeX(this.sign)}${this.rhs.toString()}`;
	}
	/** @return {Equation} */
	clone() {
		return new Equation(this.lhs.clone(), this.rhs.clone(), {
			aligned: this.aligned,
			sign: this.sign,
		});
	}
}

/**
 * @param {Sign} sign
 * @returns {Sign}
 */
export function switchInequalitySign(sign) {
	/** @type {Record<Sign,Sign>} */
	const signObject = {
		'=': '=',
		'>': '<',
		'>=': '<=',
		'<': '>',
		'<=': '>=',
		'!=': '!=',
	};
	return signObject[sign];
}
/**
 * @param {Sign} sign
 * @returns {string}
 */
export function signToLaTeX(sign) {
	return {
		'=': '= ',
		'>': '> ',
		'>=': '\\geq ',
		'<': '< ',
		'<=': '\\leq ',
		'!=': '\\neq ',
	}[sign];
}
