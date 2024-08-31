import { Equation, signToLaTeX, switchInequalitySign } from './equation.js';
export { Equation };
import {
	Numeral,
	Product,
	Sum,
	quotient,
	shorthandToExpression,
	sum,
} from '../../core/expression/expression.js';
import { Expression, Polynomial } from '../../index.js';
import { expressionToPolynomial } from '../../utils/expression-to-polynomial.js';
import { combineFraction } from '../../algebra/combine-fraction.js';
import { Brackets, sqrtTerm, simplifySurd } from '../../fns/index.js';

/** @typedef {import('../../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../../core/expression/expression.js').Variable} Variable */
/** @typedef {import('./equation.js').Sign} Sign */

/** @typedef {{hide?: boolean, string?: boolean, swapSides?: true}} WorkingOptions */

/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class EquationWorking {
	/** @type {Equation} the current equation */
	eqn;
	/** @type {[(Expression|string), Sign, (Expression|string)][]} array of the lhs/rhs expressions on each step */
	eqns;
	/** @type {boolean}	 */
	aligned;
	/** @type {[number[], string[]]} */
	interjections = [[], []];

	/**
	 * Creates an ExpressionWorking
	 * @param {Equation|Shorthand} lhs - the initial expression on the left
	 * @param {Shorthand} [rhs=0] - the initial expression on the right. (ignored if Equation supplied for previous argument)
	 * @param {{sign?: Sign, aligned?: boolean, hideFirstStep?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
	 */
	constructor(lhs, rhs = 0, options) {
		this.eqn =
			lhs instanceof Equation
				? lhs
				: new Equation(
						shorthandToExpression(lhs),
						shorthandToExpression(rhs),
						options,
					);
		this.eqns = options?.hideFirstStep
			? []
			: [[this.eqn.lhs, this.eqn.sign, this.eqn.rhs]];
		this.aligned = options?.aligned ?? false;
	}

	/**
	 * @returns {EquationWorking}
	 */
	clone() {
		const working = new EquationWorking(this.eqn.clone());
		working.eqns = this.eqns.map(([lhs, sign, rhs]) => {
			return [
				typeof lhs === 'string' ? lhs : lhs.clone(),
				sign,
				typeof rhs === 'string' ? rhs : rhs.clone(),
			];
		});
		working.aligned = this.aligned;
		working.interjections = [
			[...this.interjections[0]],
			[...this.interjections[1]],
		];
		return working;
	}

	/**
	 * register a custom simplifier
	 *  @argument {(exp: Expression)=>Expression} simplifier
	 * 	@returns {void}
	 */
	static RegisterCustomSimplifier(simplifier) {
		Expression.RegisterCustomSimplifier(simplifier);
	}
	/**
	 * deregister the last custom simplifier
	 * @returns {void}
	 * */
	static DeregisterCustomSimplifier() {
		Expression.DeregisterCustomSimplifier();
	}

	/**
	 * @param {WorkingOptions} [options]
	 */
	removeLogarithm(options) {
		this.eqn = this.eqn.removeLogarithm();
		return addStep(this, options);
	}

	/**
	 * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
	 * @param {WorkingOptions & {verbatim?: boolean, showSteps?: boolean}} [options] - default to automatic simplification
	 * @returns {EquationWorking}
	 */
	subIn(scope, options) {
		if (options?.showSteps) {
			/** @type {Record<string, Shorthand>} */
			const bracketedScope = {};
			const keys = Object.keys(scope);
			for (const key of keys) {
				const value = /** @type {Shorthand} */ (scope[key]);
				bracketedScope[key] = new Brackets(value);
			}
			this.eqn = this.eqn.subIn(bracketedScope, { verbatim: true });
			addStep(this, options);
		}
		this.eqn = this.eqn.subIn(scope, options);
		addStep(this, options);
		if (options?.verbatim) return this;
		this.eqn = this.eqn.clone().simplify();
		return addStep(this, options);
	}

	/** @typedef {import('../../core/expression/expression.js').SimplifyOptions} SimplifyOptions */
	/**
	 * @param {WorkingOptions & SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {EquationWorking}
	 * */
	simplify(options) {
		this.eqn = this.eqn.clone().simplify(options);
		return addStep(this, options);
	}

	/**
	 *
	 * @param {number|number[]|[number[], number[]]} indices
	 * @param {WorkingOptions & {fromRight?: boolean}} [options] - default from lhs
	 * @returns {EquationWorking}
	 */
	moveTerms(indices, options) {
		if (
			Array.isArray(indices) &&
			Array.isArray(indices[0]) &&
			Array.isArray(indices[1])
		) {
			const [leftIndices, rightIndices] = indices;
			const leftTerms =
				this.eqn.lhs.node.type !== 'sum'
					? [this.eqn.lhs]
					: this.eqn.lhs._getSumTerms();
			const rightTerms =
				this.eqn.rhs.node.type !== 'sum'
					? [this.eqn.rhs]
					: this.eqn.rhs._getSumTerms();
			const leftTermsToMove = leftTerms.filter((_, i) =>
				leftIndices.includes(i),
			);
			const leftTermsToKeep = leftTerms.filter(
				(_, i) => !leftIndices.includes(i),
			);
			const rightTermsToMove = rightTerms.filter((_, i) =>
				rightIndices.includes(i),
			);
			const rightTermsToKeep = rightTerms.filter(
				(_, i) => !rightIndices.includes(i),
			);
			const lhs = sum(
				...leftTermsToKeep,
				...rightTermsToMove.map((x) => x.negative()),
			);
			const rhs = sum(
				...rightTermsToKeep,
				...leftTermsToMove.map((x) => x.negative()),
			);
			this.eqn = new Equation(lhs, rhs, this.eqn.options);
			return addStep(this, options);
		}
		// TODO: show steps to get final result
		const exp = options?.fromRight ? this.eqn.rhs : this.eqn.lhs;
		// note: moving singletons done via the makeRHSZero method
		if (exp.node.type !== 'sum') {
			if (indices !== 0)
				throw new Error('unexpected index received when moving non-sum');
			this.eqn = this.eqn.minus(exp);
			return addStep(this, options);
		}
		const indicesArray = typeof indices === 'number' ? [indices] : indices;
		const terms = exp.node.terms;
		/** @type {Expression[]} */
		const newTerms = [];
		for (const index of indicesArray) {
			if (Array.isArray(index))
				throw new Error(
					'unexpected error. we believe we should not have an array at this moment',
				);
			// NOTE: user is to ensure validity of indices
			const term = /** @type {Expression} */ (terms[index]);
			newTerms.push(term.negative());
		}
		this.eqn = this.eqn.plus(new Expression(new Sum(...newTerms)));
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	swapSides(options) {
		this.eqn = this.eqn.swapSides();
		return addStep(this, options);
	}

	/**
	 * @param {Shorthand} exp
	 * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options]
	 * @returns {EquationWorking}
	 */
	times(exp, options) {
		this.eqn = this.eqn.times(exp, options);
		return addStep(this, options);
	}
	/**
	 * @param {Shorthand} exp
	 * @param {WorkingOptions & {verbatim?: boolean}} [options]
	 * @returns {EquationWorking}
	 */
	minus(exp, options) {
		this.eqn = this.eqn.minus(exp, options);
		return addStep(this, options);
	}
	/**
	 * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options]
	 * @returns {EquationWorking}
	 */
	square(options) {
		this.eqn = this.eqn.square(options);
		return addStep(this, options);
	}

	/**
	 * @param {Shorthand} exp
	 * @param {WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	divide(exp, options) {
		this.eqn = this.eqn.divide(exp);
		return addStep(this, options);
	}
	/**
	 * @param {Shorthand} exp
	 * @param {WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	divideByFactor(exp, options) {
		this.eqn = this.eqn.divideByFactor(exp);
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions & {verbatim?: boolean, expand?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
	 * @returns {EquationWorking}
	 */
	crossMultiply(options) {
		this.eqn = this.eqn.crossMultiply(options);
		if (options?.expand) {
			this.eqn = this.eqn.expand(options);
		}
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions & import('../../core/expression/expression.js').ExpansionOptions} [options]
	 * @returns {EquationWorking}
	 */
	expand(options) {
		this.eqn = this.eqn.expand(options);
		return addStep(this, options);
	}
	/**
	 * isolate variable such that only terms with the variable are on the lhs
	 * @param {string|Variable} [variable='x'] - defaults to 'x'
	 * @param {WorkingOptions & { steps?: boolean; targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	isolate(variable = 'x', options) {
		// TODO: handle target. For now always move lhs terms to rhs
		// TODO: move terms from rhs to lhs
		// TODO handle other types other than sums
		/** @type {Expression[]} */
		const lhsTermsToMove = [];
		/** @type {Expression[]} */
		const lhsTermsToKeep = [];
		/** @type {Expression[]} */
		const rhsTermsToMove = [];
		/** @type {Expression[]} */
		const rhsTermsToKeep = [];
		if (this.eqn.lhs.node.type === 'sum') {
			for (const term of this.eqn.lhs._getSumTerms()) {
				if (term.contains(variable)) {
					lhsTermsToKeep.push(term.clone());
				} else {
					lhsTermsToMove.push(term.negative());
				}
			}
		} else {
			if (this.eqn.lhs.contains(variable)) {
				lhsTermsToKeep.push(this.eqn.lhs.clone());
			} else {
				lhsTermsToMove.push(this.eqn.lhs.negative());
			}
		}
		if (this.eqn.rhs.node.type === 'sum') {
			for (const term of this.eqn.rhs._getSumTerms()) {
				if (term.contains(variable)) {
					rhsTermsToMove.push(term.negative());
				} else {
					rhsTermsToKeep.push(term.clone());
				}
			}
		} else {
			if (this.eqn.rhs.contains(variable)) {
				rhsTermsToMove.push(this.eqn.rhs.negative());
			} else {
				rhsTermsToKeep.push(this.eqn.rhs.clone());
			}
		}
		let lhs = new Expression(new Sum(...lhsTermsToKeep, ...rhsTermsToMove));
		let rhs = new Expression(new Sum(...rhsTermsToKeep, ...lhsTermsToMove));
		if (lhs.is.negative()) {
			lhs = new Expression(
				new Sum(
					...[...rhsTermsToMove, ...lhsTermsToKeep].map((x) => x.negative()),
				),
			);
			rhs = new Expression(
				new Sum(
					...[...lhsTermsToMove, ...rhsTermsToKeep].map((x) => x.negative()),
				),
			);
		}
		if (options?.steps) {
			this.eqn = new Equation(lhs.clone(), rhs.clone(), {
				sign: this.eqn.sign,
				aligned: this.aligned,
			});
			addStep(this, options);
		}
		// hack to change -x+y to y-x
		let lhsSimplified = lhs.simplify();
		let rhsSimplified = rhs.simplify();
		if (lhsSimplified.node.type === 'sum') {
			const firstTerm = lhsSimplified.node.terms[0];
			const lastTerm =
				lhsSimplified.node.terms[lhsSimplified.node.terms.length - 1];
			if (
				firstTerm &&
				firstTerm.is.negative() &&
				lastTerm &&
				!lastTerm.is.negative()
			) {
				lhsSimplified = new Expression(
					new Sum(...lhsSimplified.node.terms.toReversed()),
				);
			}
		}
		if (rhsSimplified.node.type === 'sum') {
			const firstTerm = rhsSimplified.node.terms[0];
			const lastTerm =
				rhsSimplified.node.terms[rhsSimplified.node.terms.length - 1];
			if (
				firstTerm &&
				firstTerm.is.negative() &&
				lastTerm &&
				!lastTerm.is.negative()
			) {
				rhsSimplified = new Expression(
					new Sum(...rhsSimplified.node.terms.toReversed()),
				);
			}
		}
		this.eqn = new Equation(lhsSimplified, rhsSimplified, {
			sign: this.eqn.sign,
			aligned: this.aligned,
		});
		return addStep(this, options);
	}
	/**
	 * make rhs = 0 by subtracting rhs from both sides
	 * @param {WorkingOptions} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	makeRhsZero(options) {
		let eqn = this.eqn.minus(this.eqn.rhs).expand();
		if (this.eqn.lhs instanceof Polynomial) {
			try {
				eqn = new Equation(
					this.eqn.lhs.minus(expressionToPolynomial(this.eqn.rhs)),
					0,
					{ sign: this.eqn.sign, aligned: this.aligned },
				);
			} catch {}
		}
		this.eqn = eqn;
		return addStep(this, options);
	}

	factorize = {
		/**
		 * factorizes by taking out common factor
		 * @param {WorkingOptions & {targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		commonFactor: (options) => {
			this.eqn = this.eqn.clone().factorize.commonFactor(options);
			addStep(this, options);
			options;
			if (options?.verbatim) {
				return this;
			}
			// show simplification steps
			// TODO: for simplification steps on the right, and if it is aligned, lhs string should just be ''
			const expToSimplify = options?.targetRight ? this.eqn.rhs : this.eqn.lhs;
			if (expToSimplify.node.type !== 'product') return this;
			const factors = expToSimplify._getProductTerms()[1];
			let innerSum = factors.filter((x) => x.node.type === 'sum')[0];
			if (innerSum) {
				innerSum = innerSum.expand({ verbatim: true });
				addStep(this, { string: true, ...options });
				innerSum = innerSum.expand();
				addStep(this, options);
			}
			// simplify inner sums
			// note we use a workaround by just calling the factorize function without simplification instead of trying to target said inner sum. this should be tested to prevent regression
			this.eqn = this.eqn.clone().factorize.commonFactor();
			return addStep(this, options);
		},
		/**
		 * @param {WorkingOptions & {targetRight?: boolean, variable?: string|Variable}} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		quadratic: (options) => {
			const quadratic = options?.targetRight ? this.eqn.rhs : this.eqn.lhs;
			const poly = expressionToPolynomial(quadratic, options?.variable);
			const { multiple } = poly.factorize.quadratic();
			if (!multiple.is.one()) {
				const preQuadraticFactorization = poly.factorize.commonFactor({
					forcePositiveLeadingCoefficient: true,
				});
				preQuadraticFactorization.remainingFactor.ascending = false;
				if (options?.targetRight) {
					this.eqn = new Equation(
						this.eqn.lhs.clone(),
						preQuadraticFactorization,
						{ sign: this.eqn.sign, aligned: this.aligned },
					);
				} else {
					this.eqn = new Equation(
						preQuadraticFactorization,
						this.eqn.rhs.clone(),
						{ sign: this.eqn.sign, aligned: this.aligned },
					);
				}
				addStep(this, options);
			}
			if (options?.targetRight) {
				this.eqn.rhs = poly.clone().factorize.quadratic();
			} else {
				this.eqn.lhs = poly.clone().factorize.quadratic();
			}
			return addStep(this, options);
		},
		/**
		 * @param {'lhs'|'rhs'|{lhs: number[]}|{rhs: number[]}} target - lhs/rhs (quotient) or an array if the target is a sum
		 * @param {'commonFactor'|'quadratic'} [method='quadratic'] - use quadratic factorization by default
		 * @param {WorkingOptions & {targetRight?: boolean}} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		denominator: (target, method = 'quadratic', options) => {
			this.eqn = this.eqn.factorize.denominator(target, method);
			return addStep(this, options);
		},
		/**
		 * @param {'lhs'|'rhs'} [target='lhs'] - lhs/rhs (quotient) or an array if the target is a sum
		 * @param {'commonFactor'|'quadratic'|'auto'} [method='auto'] - auto method tries quadratic factorization, followed by common factor factorization
		 * @param {WorkingOptions} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		fraction: (target = 'lhs', method = 'auto', options) => {
			this.eqn = this.eqn.factorize.fraction(target, method);
			return addStep(this, options);
		},
	};

	/**
	 * make subject from product
	 * Experimental API
	 * @param {string|Variable} [variable='x'] - defaults to 'x'
	 * @param {WorkingOptions & { steps?: 'fraction'|'divide'|'postMultiply'|'preMultiply'; targetRight?: boolean, forceSignChange?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	_makeSubjectFromProduct(variable = 'x', options) {
		// TODO: handle target. For now always move lhs terms to rhs
		// TODO: move terms from rhs to lhs
		// TODO handle other types other than products
		if (this.eqn.lhs.node.type !== 'product') return this;
		/** @type {Expression[]} */
		const factorsToMove = [];
		const [coeff, factors] = this.eqn.lhs._getProductTerms();
		let lhs = new Expression(1);
		for (const factor of factors) {
			if (!factor.contains(variable)) {
				factorsToMove.push(factor);
			} else {
				lhs = lhs.times(factor);
			}
		}
		const den = new Expression(new Product(coeff, ...factorsToMove)).simplify();
		//const rhs = new Expression(new Quotient(this.eqn.rhs, den));
		const rhs = quotient(this.eqn.rhs, den);
		const sign = coeff.is.negative()
			? switchInequalitySign(this.eqn.sign)
			: options?.forceSignChange
				? switchInequalitySign(this.eqn.sign)
				: this.eqn.sign;
		if (
			options?.steps &&
			!(den.node.type === 'numeral' && den._getNumeral().is.one())
		) {
			// given kx = a, we can either present
			// x = a/k as a fraction, or
			// x = a \div k, or
			// x = a \times k^inv or
			// x = k^inv (a)
			if (options.steps === 'fraction') {
				this.eqn = new Equation(lhs, rhs.clone(), {
					sign,
					aligned: this.aligned,
				});
				addStep(this, options);
			} else if (options.steps === 'divide') {
				this.addCustomStep(
					variable,
					`${this.eqn.rhs.toString()} \\div ${den.toString()}`,
				);
			} else if (options.steps === 'postMultiply') {
				// only works for numeral at this moment
				const reciprocal = den._getNumeral().reciprocal();
				this.addCustomStep(
					variable,
					`${this.eqn.rhs.toString()} \\times ${reciprocal.toString()}`,
				);
			} else {
				// only works for numeral at this moment
				const reciprocal = den._getNumeral().reciprocal();
				const rhs = new Expression(
					new Product(new Expression(reciprocal), this.eqn.rhs),
				);
				this.eqn = new Equation(lhs, rhs, {
					sign,
					aligned: this.aligned,
				});
				addStep(this, options);
			}
		}
		this.eqn = new Equation(lhs, rhs.simplify(), {
			sign,
			aligned: this.aligned,
		});
		return addStep(this, options);
	}

	/**
	 * @param {string} text
	 * @returns {this}
	 */
	interject(text) {
		if (this.aligned)
			console.warn('Interjections may not work properly in aligned mode');
		const [indices, texts] = this.interjections;
		indices.push(this.eqns.length - 1);
		texts.push(text);
		return this;
	}

	/**
	 * @param {number[]} order
	 * @param {{targetRight?: boolean} & WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	rearrange(order, options) {
		this.eqn = this.eqn.rearrange(order, options);
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions} [options] - default to target lhs
	 * @returns {EquationWorking}
	 */
	positiveIndexNotation(options) {
		this.eqn = this.eqn.positiveIndexNotation();
		return addStep(this, options);
	}

	/**
	 * @param {{target?: 'l'|'r'|'b'} & WorkingOptions} [options] default to target both
	 * @returns {EquationWorking}
	 */
	combineFraction(options) {
		const target = options?.target ?? 'b';
		const lhs =
			target === 'l' || target === 'b'
				? combineFraction(this.eqn.lhs)
				: this.eqn.lhs.clone();
		const rhs =
			target === 'r' || target === 'b'
				? combineFraction(this.eqn.rhs)
				: this.eqn.rhs.clone();
		this.eqn = new Equation(lhs, rhs, this.eqn.options);
		return addStep(this, options);
	}

	/**
	 *
	 * @param {WorkingOptions & {target?: 'l'|'r'|'b'}} [options]
	 * @returns {EquationWorking}
	 */
	toPolynomial(options) {
		this.eqn = this.eqn.toPolynomial(options);
		return addStep(this, options);
	}

	/**
	 * @param {string} [variable='x']
	 * @param {WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	toGeneralPolynomial(variable = 'x', options) {
		this.eqn = this.eqn.toGeneralPolynomial(variable);
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions} [options]
	 * @returns {EquationWorking}
	 */
	inverse(options) {
		this.eqn = this.eqn.inverse();
		return addStep(this, options);
	}

	solve = {
		/**
		 * @param {string} [variable='x']
		 * @param {{hideFirstLine?: boolean, aligned?: boolean, qed?: true|string}} [options]
		 * @returns {EquationWorking & {root: Expression}}
		 */
		linear: (variable = 'x', options) => {
			const { working, root } = solve.linear(this.eqn, variable, {
				aligned: this.aligned,
				...options,
			});
			this.eqns = this.eqns.concat(working.eqns.slice(1));
			this.eqn = working.eqn;
			/** @type {EquationWorking & {root?: Expression}} */
			const eqnWorking = this.clone();
			eqnWorking.root = root;
			return /** @type {EquationWorking & {root: Expression}} */ (eqnWorking);
		},
		/**
		 * @param {string} [variable] - we will use variable if exp not of Polynomial class
		 * @param {{hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
		 * @returns {EquationWorking & {rootsWorking:string, roots: Expression[]}}
		 */
		quadratic: (variable, options) => {
			this.makeRhsZero();
			const polynomial =
				this.eqn.lhs instanceof Polynomial
					? this.eqn.lhs
					: expressionToPolynomial(this.eqn.lhs, variable);
			const discriminant = polynomial.quadraticDiscriminant();
			Expression.RegisterCustomSimplifier(simplifySurd);
			const sqrtDiscriminant = sqrtTerm(discriminant).simplify();
			if (sqrtDiscriminant.is.negative()) {
				throw new Error('we do not support complex roots at this moment');
			} else if (sqrtDiscriminant.is.numeral()) {
				Expression.DeregisterCustomSimplifier();
				const { factorizationWorking, rootsWorking, roots } = solve.quadratic(
					this.eqn,
					variable,
					{
						...options,
					},
				);
				this.eqns = this.eqns.concat(factorizationWorking.eqns.slice(1));
				this.eqn = factorizationWorking.eqn;
				/** @type {EquationWorking & {rootsWorking?:string, roots?: Expression[]}} */
				const eqnWorking = this.clone();
				eqnWorking.rootsWorking = rootsWorking;
				eqnWorking.roots = roots;
				return /** @type {EquationWorking & {rootsWorking:string, roots: Expression[]}} */ (
					eqnWorking
				);
			} else {
				const [c, b, a] = polynomial.coeffs;
				if (c === undefined || b === undefined || a === undefined)
					throw new Error(
						`Unexpected coefficients: expected quadratic equation.`,
					);
				const twoA = new Expression([2, a]);
				const negativeB = new Expression([-1, b]);
				const sqrtWorking = sqrtTerm(['+', [b, '^', 2], [-4, a, c]], {
					verbatim: true,
				});
				const rootsWorking =
					`x &= \\frac{${negativeB.toString()} \\pm ${sqrtWorking.toString()}}{${twoA.toString()}}` +
					`\n\t\\\\ &= \\frac{${negativeB.simplify().toString()} \\pm ${sqrtWorking.simplify().toString()}}{${twoA.simplify().toString()}}`;
				// TODO: simplification using gcd
				// TODO: sort roots
				const root1 = new Expression([
					['+', negativeB, [-1, sqrtWorking]],
					'/',
					twoA,
				]).simplify();
				const root2 = new Expression([
					['+', negativeB, sqrtWorking],
					'/',
					twoA,
				]).simplify();
				/** @type {EquationWorking & {rootsWorking?:string, roots?: Expression[]}} */
				const eqnWorking = this.clone();
				eqnWorking.rootsWorking = rootsWorking;
				eqnWorking.roots = [root1, root2];
				Expression.DeregisterCustomSimplifier();
				return /** @type {EquationWorking & {rootsWorking:string, roots: Expression[]}} */ (
					eqnWorking
				);
			}
		},
		/**
		 * @param {string} [variable] - we will use variable if exp not of Polynomial class
		 * @param {{sign?: Sign, hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
		 * @returns {EquationWorking & {answers: string[], roots: [Numeral, Numeral]}}
		 */
		quadraticInequality: (variable, options) => {
			const { working, roots, answers } = solve.quadraticInequality(
				this.eqn,
				variable,
				{ ...options },
			);
			this.eqns = this.eqns.concat(working.eqns.slice(1));
			this.eqn = working.eqn;
			/** @type {EquationWorking & {answers?: string[], roots?: [Numeral, Numeral]}} */
			const eqnWorking = this.clone();
			eqnWorking.answers = answers;
			eqnWorking.roots = roots;
			return /** @type {EquationWorking & {answers: string[], roots: [Numeral, Numeral]}} */ (
				eqnWorking
			);
		},
	};

	/**
	 * @param {string} [variable='x']
	 * @param {WorkingOptions} [options]
	 */
	differentiate(variable = 'x', options) {
		this.eqn = this.eqn.differentiate(variable);
		return addStep(this, options);
	}

	/**
	 * @param {(exp:Expression)=>string|undefined} toStringFn
	 * @return {string}
	 */
	toCustomString(toStringFn) {
		const align = this.aligned ? `&` : ``;
		const firstEqn = this.eqns[0];
		if (!firstEqn) return '';
		const [firstLHS, sign, firstRHS] = firstEqn;
		const firstLHSString =
			typeof firstLHS === 'string'
				? firstLHS
				: firstLHS.toCustomString(toStringFn);
		const firstRHSString =
			typeof firstRHS === 'string'
				? firstRHS
				: firstRHS.toCustomString(toStringFn);
		let str = `${firstLHSString} ${align}${signToLaTeX(sign)}${firstRHSString}`;
		const index = this.interjections[0].indexOf(0);
		if (index !== -1) str += `\n\t\\\\ ${this.interjections[1][index]}`;
		let prevLHS = firstLHSString;
		for (const [i, [lhs, sign, rhs]] of this.eqns.slice(1).entries()) {
			const lhsC =
				typeof lhs === 'string' ? lhs : lhs.toCustomString(toStringFn);
			const lhsString = this.aligned && lhsC === prevLHS ? '' : lhsC;
			const rhsC =
				typeof rhs === 'string' ? rhs : rhs.toCustomString(toStringFn);
			str += `\n\t\\\\ ${lhsString} ${align}${signToLaTeX(sign)}${rhsC}`;
			const index = this.interjections[0].indexOf(i + 1);
			if (index !== -1) str += `\n\t\\\\ ${this.interjections[1][index]}`;
			prevLHS = lhsC;
		}
		return str;
	}
	/**
	 *
	 * @return {string}
	 */
	toString() {
		const align = this.aligned ? `&` : ``;
		const firstEqn = this.eqns[0];
		if (!firstEqn) return '';
		const [firstLHS, sign, firstRHS] = firstEqn;
		let str = `${firstLHS.toString()} ${align}${signToLaTeX(sign)}${firstRHS.toString()}`;
		const index = this.interjections[0].indexOf(0);
		if (index !== -1) str += `\n\t\\\\ ${this.interjections[1][index]}`;
		let prevLHS = firstLHS.toString();
		for (const [i, [lhs, sign, rhs]] of this.eqns.slice(1).entries()) {
			const lhsString =
				this.aligned && lhs.toString() === prevLHS ? '' : lhs.toString();
			str += `\n\t\\\\ ${lhsString} ${align}${signToLaTeX(sign)}${rhs.toString()}`;
			const index = this.interjections[0].indexOf(i + 1);
			if (index !== -1) str += `\n\t\\\\ ${this.interjections[1][index]}`;
			prevLHS = lhs.toString();
		}
		return str;
	}

	/**
	 * @returns {string[]}
	 */
	_to_string_array() {
		const align = this.aligned ? `&` : ``;
		const firstEqn = this.eqns[0];
		if (!firstEqn) return [];
		const [firstLHS, sign, firstRHS] = firstEqn;
		let str = [`${firstLHS.toString()} ${align}${sign}${firstRHS.toString()}`];
		const index = this.interjections[0].indexOf(0);
		if (index !== -1) str.push(`\n\t\\\\ ${this.interjections[1][index]}`);
		let prevLHS = firstLHS.toString();
		for (const [i, [lhs, sign, rhs]] of this.eqns.slice(1).entries()) {
			const lhsString =
				this.aligned && lhs.toString() === prevLHS ? '' : lhs.toString();
			str.push(`${lhsString} ${align}${sign}${rhs.toString()}`);
			const index = this.interjections[0].indexOf(i + 1);
			if (index !== -1)
				str.push(/** @type {string} */ (this.interjections[1][index]));
			prevLHS = lhs.toString();
		}
		return str;
	}

	/**
	 * @param {Equation|Shorthand|string|number} lhs
	 * @param {Shorthand} [rhs] - defaults to original rhs
	 * @param {{sign?: Sign} & WorkingOptions} [options]
	 * @return {EquationWorking}
	 */
	addCustomStep(lhs, rhs, options) {
		if (typeof lhs === 'string' || typeof lhs === 'number') {
			this.eqns.push([
				lhs.toString(),
				options?.sign ?? '=',
				(rhs ?? this.eqn.rhs).toString(),
			]);
			return this;
		}
		this.eqn =
			lhs instanceof Equation
				? lhs
				: new Equation(
						shorthandToExpression(lhs),
						rhs ? shorthandToExpression(rhs) : this.eqn.rhs,
						options,
					);
		return addStep(this, options);
	}
}

/**
 * @param {EquationWorking} working
 * @param {WorkingOptions & {target?: 'l'|'r'|'b'}} [options] - options to target l/r/both(default)
 * @returns {EquationWorking}
 */
function addStep(working, options) {
	//TODO: hide for empty array (hidden first step)
	const [prevLeft, _, prevRight] = working.eqns[working.eqns.length - 1] ?? [
		'',
		working.eqn.sign,
		'',
	];
	let lhs = working.eqn.lhs;
	let rhs = working.eqn.rhs;
	if (options?.swapSides) {
		[lhs, rhs] = [rhs, lhs];
		working.eqn = working.eqn.swapSides();
	}
	if (
		!options?.hide &&
		(prevLeft.toString() !== lhs.toString() ||
			prevRight.toString() !== rhs.toString())
	) {
		if (options?.string) {
			working.eqns.push([lhs.toString(), working.eqn.sign, rhs.toString()]);
		} else {
			working.eqns.push([lhs, working.eqn.sign, rhs]);
		}
	}
	return working;
}

export const solve = {
	/**
	 * @param {Expression|Equation|Shorthand} expression
	 * @param {string|Variable} [variable='x']
	 * @param {{hideFirstLine?: boolean, aligned?: boolean, qed?: true|string}} [options]
	 * @returns {{working: EquationWorking, root: Expression}}
	 */
	linear: (expression, variable = 'x', options) => {
		const working = new EquationWorking(expression, 0, options);
		working.isolate(variable);
		working.factorize.commonFactor();
		working._makeSubjectFromProduct(variable);
		return { working, root: working.eqn.rhs };
	},
	/**
	 * @param {Expression|Equation} expression
	 * @param {string|Variable} [variable='x']
	 * @param {{hideFirstLine?: boolean, aligned?: boolean, qed?: true|string}} [options]
	 * @returns {{working: string, roots: Expression[]}}
	 */
	zeroProduct: (expression, variable = 'x', options) => {
		if (
			expression.type !== 'expression' &&
			!(expression.rhs.node.type === 'numeral' && expression.rhs.node.is.zero())
		) {
			throw new Error('The right-hand side of the equation must be zero');
		}
		expression = expression.type !== 'expression' ? expression.lhs : expression;
		const qedSymbol = options?.qed
			? typeof options.qed === 'string'
				? `${options.qed} `
				: `\\quad\\blacksquare `
			: '';
		if (expression.node.type === 'exponent') {
			const { working, root } = solve.linear(
				expression.node.base,
				variable,
				options,
			);
			return {
				working: working.toString() + qedSymbol,
				roots: [root],
			};
		} else if (expression.node.type === 'product') {
			/** @type {EquationWorking[]} */
			const workings = [];
			/** @type {Expression[]} */
			const roots = [];
			expression.node.factors.forEach((factor) => {
				const { working, root } = solve.linear(factor, variable, {
					...options,
					aligned: true,
				});
				workings.push(working);
				roots.push(root);
			});
			const rows = workings.map((working) => working._to_string_array());
			const finalRows = rows.map((arr) => arr.length);
			const maxRows = Math.max(...finalRows);
			let content = '';
			for (let i = 0; i < maxRows; i++) {
				const separator =
					i === 0 ? ' &&\\quad\\text{ or }\\quad& ' : ' &&\\quad& ';
				if (i !== 0) content += '\n\t\\\\ ';
				for (const [j, row] of rows.entries()) {
					content += j === 0 ? '' : separator;
					content += row[i] ?? '&';
					const qed =
						i === /** @type {number} */ (finalRows[j]) - 1 ? qedSymbol : '';
					content += qed;
				}
			}
			return { working: content, roots };
		} else {
			throw new Error('The expression must be a product or an exponent');
		}
	},
	/**
	 * @param {Expression|Polynomial|Equation|[Expression, Expression]} exp
	 * @param {string|Variable} [variable] - we will use variable if exp not of Polynomial class
	 * @param {{hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
	 * @returns {{factorizationWorking: EquationWorking, rootsWorking:string, roots: Expression[]}}
	 */
	quadratic: (exp, variable, options) => {
		// todo: options for alignment mode
		// TODO: remove variable option
		const eqn = Array.isArray(exp)
			? new Equation(exp[0], exp[1])
			: exp.type !== 'expression'
				? exp
				: new Equation(exp);
		const factorizationWorking = new EquationWorking(eqn, 0, options);
		factorizationWorking.makeRhsZero({
			hide: options?.hideFirstStep && eqn.rhs.toString() === '0',
		});
		variable = variable ?? expressionToPolynomial(eqn.lhs).variable;
		factorizationWorking.factorize.quadratic({ variable });
		const { working: rootsWorking, roots } = solve.zeroProduct(
			factorizationWorking.eqn,
			variable,
			{
				aligned: true,
				...options,
			},
		);
		return { factorizationWorking, rootsWorking, roots };
	},
	/**
	 * @param {Expression|Polynomial|Equation|[Expression,Sign,Expression]} exp
	 * @param {string|Variable} [variable] - we will use variable if exp not of Polynomial class
	 * @param {{sign?: Sign, hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
	 * @returns {{working: EquationWorking, answers: string[], roots: [Numeral, Numeral]}}
	 */
	quadraticInequality: (exp, variable, options) => {
		const eqn = Array.isArray(exp)
			? new Equation(exp[0], exp[2], { sign: exp[1] })
			: exp.type !== 'expression'
				? exp
				: new Equation(exp, 0, options);
		const working = new EquationWorking(eqn, 0, options);
		working.makeRhsZero({
			hide: options?.hideFirstStep && eqn.rhs.toString() === '0',
		});
		const poly = expressionToPolynomial(working.eqn.lhs, variable);
		variable = variable ?? poly.variable;
		const leadingCoeff = /**@type{Numeral}*/ (poly.leadingCoefficient);
		const gcd = Numeral.gcd(.../**@type {Numeral[]}*/ (poly.coeffs));
		if (leadingCoeff.is.negative() || !gcd.is.one()) {
			const divisor = gcd.times(Math.sign(leadingCoeff.valueOf()));
			working.times(divisor.reciprocal(), { expand: true });
		}
		working.factorize.quadratic({ variable });
		const { roots: rootsExp } = solve.zeroProduct(working.eqn, variable, {
			aligned: true,
			...options,
		});
		const numerals = rootsExp.map((root) => root._getNumeral());
		if (numerals.length !== 2) {
			throw new Error(
				'We only support quadratic inequality with exactly two roots',
			);
		}
		const roots = /** @type {[Numeral, Numeral]} */ ([
			numerals[0],
			numerals[1],
		]);
		// assumed roots are already sorted from factorization step
		// test sign of left side
		const testPoint = roots[0].minus(1);
		const val = poly.evaluate(testPoint);
		const lessThan = eqn.sign === '<' || eqn.sign === '<=';
		const lessThanSign = switchToLessThan(eqn.sign);
		const answers =
			val.is.negative() === lessThan
				? [
						new Equation(variable, roots[0], { sign: lessThanSign }).toString(),
						new Equation(variable, roots[1], {
							sign: switchInequalitySign(lessThanSign),
						}).toString(),
					]
				: [
						`${roots[0].toString()} ${signToLaTeX(lessThanSign)}${variable.toString()} ${signToLaTeX(lessThanSign)}${roots[1].toString()}`,
					];
		return { working, roots, answers };
	},
	/**
	 * @param {Expression|Polynomial|Equation|[Expression,Sign,Expression]} exp
	 * @param {string|Variable} [variable='x']
	 * @param {{sign?: Sign, hideFirstStep?: boolean, aligned?: boolean, qed?: true|string}} [options]
	 * @returns {{working: EquationWorking, answers: string[], roots: Numeral[]}}
	 */
	rationalInequality: (exp, variable = 'x', options) => {
		const eqn = Array.isArray(exp)
			? new Equation(exp[0], exp[2], { sign: exp[1] })
			: exp.type !== 'expression'
				? exp
				: new Equation(exp, 0, options);
		const working = new EquationWorking(eqn, 0, options);
		working.makeRhsZero({
			hide: options?.hideFirstStep && eqn.rhs.toString() === '0',
		});
		working.combineFraction();
		working.factorize.fraction();
		const rational = working.eqn.lhs;
		const [num, den] = rational._getQuotientTerms();
		// TODO: cases where we have one or zero roots
		// TODO: equality cases
		/** @type {Numeral[]} */
		const roots = [
			...solve.zeroProduct(num).roots.map((x) => x._getNumeral()),
			...solve.zeroProduct(den).roots.map((x) => x._getNumeral()),
		];
		/** @type {string[]} */
		const answers = [];
		roots.sort((a, b) => a.valueOf() - b.valueOf());
		if (roots.length === 0) throw new Error('No roots found');
		const firstRoot = /**@type {Numeral}*/ (roots[0]);
		const testPoint = firstRoot.minus(1);
		const testValueIsNegative = rational
			.subIn({ [variable.toString()]: testPoint })
			.is.negative();
		if (
			(eqn.sign === '<' && testValueIsNegative) ||
			(eqn.sign === '>' && !testValueIsNegative)
		) {
			answers.push(`${variable.toString()} < ${firstRoot.toString()}`);
		}
		for (const [i, root] of roots.entries()) {
			if (i === roots.length - 1) {
				const testPoint = root.plus(1);
				const testValueIsNegative = rational
					.subIn({ [variable.toString()]: testPoint })
					.is.negative();
				if (
					(eqn.sign === '<' && testValueIsNegative) ||
					(eqn.sign === '>' && !testValueIsNegative)
				) {
					answers.push(`${variable.toString()} > ${root.toString()}`);
				}
			} else {
				const root2 = /** @type {Numeral} */ (roots[i + 1]);
				const testPoint = root.plus(root2).divide(2);
				const testValueIsNegative = rational
					.subIn({ [variable.toString()]: testPoint })
					.is.negative();
				if (
					(eqn.sign === '<' && testValueIsNegative) ||
					(eqn.sign === '>' && !testValueIsNegative)
				) {
					answers.push(
						`${root.toString()} < ${variable.toString()} < ${root2.toString()}`,
					);
				}
			}
		}
		return { working, answers, roots };
	},
};

/**
 * Helps set up in-between inequalities
 * @param {Sign} sign
 * @returns {'<'|'<='}
 */
export function switchToLessThan(sign) {
	if (sign === '<' || sign === '>') {
		return '<';
	} else if (sign === '<=' || sign === '>=') {
		return '<=';
	}
	throw new Error('Invalid sign');
}
