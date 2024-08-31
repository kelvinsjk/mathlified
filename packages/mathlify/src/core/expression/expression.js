import { Numeral } from './numeral/numeral.js';
import { Variable } from './variable/variable.js';
import { Fn } from './fn/custom-function.js';
import { Exponent } from './exponent/exponent.js';
import { Product } from './product/product.js';
import { Quotient } from './quotient/quotient.js';
import { Sum } from './sum/sum.js';
import { arrayHasLengthEqualTo } from '../../utils/typescript/array-length.js';

export { Numeral, Variable, Fn, Exponent, Product, Quotient, Sum };

/** @typedef {Variable|Numeral|Sum|Product|Quotient|Exponent|Fn} ExpressionNode */

/** @typedef {['+', ...(number|string|Shorthand)[]]} SumShorthand */
/** @typedef {(number|string|Shorthand)[]} ProductShorthand */
/** @typedef {[Shorthand, '/', Shorthand]} QuotientShorthand */
/** @typedef {[Shorthand, '^', Shorthand]} ExponentShorthand */
/** @typedef {number|string|ExpressionNode|Expression|ProductShorthand|SumShorthand|QuotientShorthand|ExponentShorthand} Shorthand */

/** @typedef {{verbatim?: boolean|'quotient'}} SimplifyOptions */
/** @typedef {{verbatim?: boolean|'quotient', numeratorOnly?: boolean, onlyLinear?: boolean}} ExpansionOptions */

///** @type {((exp: Expression)=>Expression)[]} */
//const pre_simplifiers = [];
/** @type {((exp: Expression)=>Expression)[]} */
const post_simplifiers = [];
/** @type {((exp: Expression)=>string|undefined)[]} */
const custom_to_string_fns = [];

/**
 * The `Expression` class contains the tree representation of
 * a mathematical expression built from the following nodes:
 * - `Numeral` for numbers (only "Fraction"s supported at the moment, support for floats in the future)
 * - `Variable` for symbols
 * - `Sum` for n-ary addition
 * - `Product` for n-ary multiplication. Subtraction is represented by a negative coefficient
 * - `Quotient` for division
 * - `Exponent` for exponentiation
 * - `Fn` for functions, which can be configured
 * @property {'expression'} type
 * @property {ExpressionNode} node - the node representing the expression
 */
export class Expression {
	/** @type {'expression'} */
	type = 'expression';
	/** @type {ExpressionNode} */
	node;

	/**
	 * @constructor
	 * Creates an `Expression` instance.
	 * You can use shorthands for complicated nodes,
	 * though we recommend the sum function for better readability
	 *
	 * By default, we simplify the expression. Use {verbatim: true} to disable simplification
	 *
	 * @param {Shorthand} node
	 */
	constructor(node) {
		if (typeof node === 'number') {
			this.node = new Numeral(node);
		} else if (typeof node === 'string') {
			this.node = new Variable(node);
		} else if (Array.isArray(node)) {
			this.node = shorthandToExpression(node).node;
		} else {
			this.node = node.type === 'expression' ? node.node : node;
		}
		//if (!options?.verbatim) {
		//	this.simplify();
		//}
	}

	/**
	 * @returns {Expression} a clone of the current instance
	 */
	clone() {
		return new Expression(this.node.clone());
	}

	// * Arithmetic methods
	/**
	 * @param {Shorthand} x
	 * @param {SimplifyOptions} [options]
	 * @return {Expression}
	 */
	plus(x, options) {
		return new Expression(
			new Sum(this.clone(), new Expression(shorthandToExpression(x))),
		).simplify(options);
	}
	/**
	 * @param {Shorthand} x
	 * @param {SimplifyOptions} [options]
	 * @return {Expression}
	 */
	minus(x, options) {
		const r = new Expression(
			new Sum(
				this.clone(),
				new Expression(new Product(-1, shorthandToExpression(x))),
			),
		).simplify(options);
		return r;
	}
	/**
	 * @param {Shorthand} x
	 * @param {SimplifyOptions & { expand?: boolean}} [options]
	 * @return {Expression}
	 */
	times(x, options) {
		const product = new Expression(
			new Product(this.clone(), shorthandToExpression(x)),
		);
		return options?.expand
			? product.expand(options)
			: product.simplify(options);
	}
	/**
	 * @param {Shorthand} x
	 * @param {SimplifyOptions} [options]
	 * @return {Expression}
	 */
	divide(x, options) {
		return new Expression(
			new Quotient(this.clone(), shorthandToExpression(x)),
		).simplify(options);
	}
	/**
	 * @param {SimplifyOptions} [options]
	 * @return {Expression}
	 */
	negative(options) {
		return new Expression(new Product(-1, this.clone())).simplify(options);
	}
	/**
	 * @returns {Expression}
	 */
	abs() {
		if (this.node.type === 'numeral' || this.node.type === 'product')
			return new Expression(this.node.abs());
		return this.clone();
	}

	/**
	 * @param {SimplifyOptions} [options]
	 * @returns {Expression}
	 *  */
	reciprocal(options) {
		// TODO: once we add the quotient / quotient simplify rule, we can remove the cases
		if (this.node.type === 'numeral' || this.node.type === 'quotient') {
			return new Expression(this.node.reciprocal()).simplify(options);
		}
		return new Expression(
			new Quotient(new Expression(1), this.clone()),
		).simplify(options);
	}
	/**
	 * @param {Shorthand} n
	 * @param {SimplifyOptions} [options]
	 * @returns {Expression}
	 *  */
	pow(n, options) {
		return new Expression([this.clone(), '^', n]).simplify(options);
	}
	/**
	 * @param {SimplifyOptions & {expand?: boolean}} [options]
	 * @returns {Expression}
	 *  */
	square(options) {
		let exp = new Expression([this.clone(), '^', 2]).simplify(options);
		if (options?.expand) {
			exp = exp.expand(options);
		}
		return exp;
	}

	/**
	 * @param {number} x
	 * @param {string|Variable} [variable]
	 * @returns {number}
	 */
	fn = (x, variable = 'x') => {
		return this.node.fn(x, variable);
	};

	/**
	 * @returns {Expression}
	 */
	positiveIndexNotation() {
		switch (this.node.type) {
			case 'product':
				return new Expression([
					this.node.coeff,
					...this.node.factors.map((factor) => factor.positiveIndexNotation()),
				]).simplify();
			case 'sum':
				return new Expression([
					'+',
					...this.node.terms.map((term) => term.positiveIndexNotation()),
				]).simplify();
			case 'quotient':
				return new Expression([
					this.node.num.positiveIndexNotation(),
					'/',
					this.node.den.positiveIndexNotation(),
				]).simplify();
			case 'exponent':
				if (
					this.node.power.node.type === 'numeral' &&
					this.node.power.node.is.negative()
				) {
					return new Expression([
						1,
						'/',
						new Expression([this.node.base, '^', this.node.power.negative()]),
					]).simplify();
				}
			default:
				return this.clone();
		}
	}

	/**
	 * subs in variables for other expressions
	 * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
	 * @param {SimplifyOptions} [options] - default to automatic simplification
	 * @returns {Expression}
	 */
	subIn(scope, options) {
		return sub_in(this, scope, options);
	}

	// * Simplify
	/**
	 * simplifies the expression
	 * @param {SimplifyOptions} [options] - options for which types to simplify
	 * @returns {Expression} the current instance after simplification. Note that this method mutates the current instance
	 */
	simplify(options) {
		if (options?.verbatim === true) return this.clone();
		let node = this.node.simplify(options);
		node = simplify_to_different_node(node, options);
		if (node.type === 'quotient' && !(options?.verbatim === 'quotient')) {
			const gcd = Expression.gcd(node.num, node.den);
			node = new Quotient(
				new Expression(divide_by_factor(node.num, gcd.node)),
				new Expression(divide_by_factor(node.den, gcd.node)),
			).simplify(options);
			// try factorizing the numerator if it is a sum
			if (node.num.node.type === 'sum') {
				const num = node.num.factorize.commonFactor();
				if (num.node.type === 'product') {
					const gcd = Expression.gcd(num, node.den);
					if (gcd.toString() !== '1') {
						node = new Quotient(
							new Expression(divide_by_factor(num, gcd.node)).expand(),
							new Expression(divide_by_factor(node.den, gcd.node)),
						).simplify(options);
					}
				}
			}
			node = simplify_to_different_node(node, options);
		} else if (node.type === 'exponent') {
			if (node.base.node.type === 'exponent') {
				node = new Exponent(
					node.base.node.base,
					new Expression([node.base.node.power, node.power]).simplify(options),
				);
				node = simplify_to_different_node(node, options);
			}
		}
		for (const simplifier of post_simplifiers) {
			node = simplifier(new Expression(node)).node;
		}
		return new Expression(node);
	}

	/**
	 * rearranges the terms of a sum in place
	 * TODO: add support for rearranging products
	 * WARNING: experimental API to be finalized in the future
	 * @param {number[]} order
	 * @returns {Expression}
	 */
	rearrange(order) {
		if (this.node.type !== 'sum') return this;
		const reorderedSum = this.node.rearrange(order);
		return new Expression(reorderedSum);
	}

	is = {
		/** @returns {boolean} */
		negative: () => {
			if (this.node.type === 'numeral' || this.node.type === 'product')
				return this.node.is.negative();
			if (this.node.type === 'sum') {
				return this.node.terms.every((term) => term.is.negative());
			}
			return false;
		},
		/** @returns {boolean} */
		variable: () => {
			if (this.node.type === 'numeral') return false;
			return this.node.is.variable();
		},
		/** @returns {boolean} */
		numeral: () => this.node.type === 'numeral',
		/**
		 * whether this expression is a product with coefficient negative one and only one factor
		 * @returns {boolean} */
		negativeUnit: () => {
			return (
				this.node.type === 'product' &&
				this.node.coeff.is.negative_one() &&
				this.node.factors.length === 1
			);
		},
	};

	/** @returns {string} */
	_to_lexical_string() {
		return this.node._to_lexical_string();
	}

	/**
	 * @param {Shorthand} factor
	 * @returns {Expression}
	 */
	_divide_by_factor(factor) {
		if (this.node.type === 'numeral' && this.node.is.zero()) return this;
		if (this.node.type === 'sum') {
			try {
				return new Expression(
					new Sum(
						...this.node.terms.map(
							(term) =>
								new Expression(
									divide_by_factor(term, shorthandToExpression(factor).node),
								),
						),
					),
				).simplify();
			} catch {
				return new Expression(
					divide_by_factor(this, shorthandToExpression(factor).node),
				).simplify();
			}
		}
		return new Expression(
			divide_by_factor(this, shorthandToExpression(factor).node),
		).simplify();
	}

	/**
	 *
	 * @param {ExpansionOptions} [options] - default to automatic simplification
	 * @returns {Expression}
	 * */
	expand(options) {
		return expand_expression(this.clone(), options);
	}

	factorize = {
		/**
		 * factorizes a sum by extracting common factors
		 * @param {SimplifyOptions} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
		 * @returns {Expression}
		 */
		commonFactor: (options) => {
			if (this.node.type === 'product') {
				const factors = this.node.factors.map((exp) =>
					exp.factorize.commonFactor(options),
				);
				return new Expression(
					new Product(new Expression(this.node.coeff.clone()), ...factors),
				).simplify(options);
			}
			if (!(this.node.type === 'sum')) return this;
			const commonFactor = Expression.gcd(...this.node.terms);
			if (commonFactor.node.type === 'numeral' && commonFactor.node.is.one())
				return this;
			const factorizedTerms = this.node.terms
				.map((term) => divide_by_factor(term, commonFactor.node))
				.map((exp) => new Expression(exp));
			/** @type {Expression|Sum} */
			let sum = new Expression(new Sum(...factorizedTerms));
			if (!options?.verbatim) {
				sum = sum.expand();
			}
			const product = new Product(
				new Expression(commonFactor.node),
				sum,
			).simplify(options);
			return new Expression(product).simplify(options);
		},
	};

	/**
	 * @param {string|Variable} variable
	 * @returns {boolean} whether the expression contains the variable
	 */
	contains(variable) {
		return this.node.contains(
			typeof variable === 'string' ? variable : variable.name,
		);
	}

	/**
	 * @returns {string} the LaTeX string representation of the expression
	 */
	toString() {
		for (const toStringFn of custom_to_string_fns) {
			const str = toStringFn(this);
			if (str) return str;
		}
		return this.node.toString();
	}
	/**
	 * Returns a custom string representation of the expression, using the provided function.
	 * If the function returns undefined, the default toString will be used
	 * @param {(exp:Expression)=>string|undefined} toStringFn
	 * @returns {string}
	 */
	toCustomString(toStringFn) {
		Expression.RegisterCustomToStringFn(toStringFn);
		const str = this.toString();
		Expression.DeregisterCustomToStringFn();
		return str;
	}
	/** @return {number} */
	valueOf() {
		return this.node.valueOf();
	}
	/**
	 * @param {number} [precision] - the number of significant digits
	 *  @return {string}
	 * */
	toPrecision(precision) {
		return this.valueOf().toPrecision(precision);
	}
	/**
	 * @param {number} [fractionDigits]
	 *  @return {string}
	 * */
	toFixed(fractionDigits) {
		return this.valueOf().toFixed(fractionDigits);
	}

	// * these methods provide quick access to the underlying expression-subtypes
	/** @returns {[Expression, Expression]} */
	_getQuotientTerms() {
		if (this.node.type === 'quotient') return [this.node.num, this.node.den];
		throw new Error('Expression is not a quotient');
	}
	/** @returns {[Expression, Expression]} */
	_getExponentTerms() {
		if (this.node.type === 'exponent') return [this.node.base, this.node.power];
		throw new Error('Expression is not an exponent');
	}
	/** @returns {Numeral} */
	_getNumeral() {
		if (this.node.type === 'numeral') return this.node;
		throw new Error('Expression is not a numeral');
	}
	/** @return {[Numeral, Expression[]]} */
	_getProductTerms() {
		if (this.node.type === 'product')
			return [this.node.coeff, this.node.factors];
		throw new Error('Expression is not a product');
	}
	/** @return {Expression} */
	_getProductTerm() {
		if (
			this.node.type === 'product' &&
			this.node.factors.length === 1 &&
			this.node.factors[0]
		)
			return this.node.factors[0];
		throw new Error('Expression is not a product with only one term');
	}
	/** @return {Expression[]} */
	_getSumTerms() {
		if (this.node.type === 'sum') return this.node.terms;
		throw new Error('Expression is not a sum');
	}

	/**
	 * if the expression is a product, returns the expression with coefficient 1
	 * @returns {Expression}
	 */
	unit() {
		if (this.node.type === 'product') {
			return new Expression(new Product(...this.node.factors));
		}
		return this.clone();
	}

	// * static methods
	/**
	 * get gcd of expressions, returning a negative gcd if all terms are negative
	 * @param {Expression[]} exps
	 * @returns {Expression}
	 */
	static gcd(...exps) {
		return expression_gcd(...exps);
	}

	/**
	 * register a custom simplifier
	 *  @argument {(exp: Expression)=>Expression} simplifier
	 * 	@returns {void}
	 */
	static RegisterCustomSimplifier(simplifier) {
		// TODO: handle pre_simplifiers
		post_simplifiers.push(simplifier);
	}
	/**
	 * deregister the last custom simplifier
	 * @returns {void}
	 * */
	static DeregisterCustomSimplifier() {
		post_simplifiers.pop();
	}
	/**
	 * register a custom toString function: if the function returns undefined, the default toString will be used
	 * @argument {(exp: Expression)=>string|undefined} toStringFn
	 * @returns {void}
	 * */
	static RegisterCustomToStringFn(toStringFn) {
		custom_to_string_fns.push(toStringFn);
	}
	/**
	 * deregister the last custom toString function
	 * @returns {void}
	 * */
	static DeregisterCustomToStringFn() {
		custom_to_string_fns.pop();
	}
}

/**
 *
 * @param {Shorthand} shorthand
 * @returns {Expression}
 */
export function shorthandToExpression(shorthand) {
	if (shorthand instanceof Expression) return shorthand;
	if (
		typeof shorthand === 'number' ||
		typeof shorthand === 'string' ||
		!Array.isArray(shorthand)
	) {
		return new Expression(shorthand);
	}
	// sum: ['+', ...]
	// product: [...]
	// quotient: [.., '/', ..]
	// exponent: [.., '^', ..]
	if (shorthand[1] === '/') {
		if (shorthand.length !== 3)
			throw new Error(
				'Invalid shorthand: quotients require exactly 3 elements',
			);
		return new Expression(
			new Quotient(
				shorthandToExpression(shorthand[0]),
				shorthandToExpression(shorthand[2]),
			),
		);
	} else if (shorthand[1] === '^') {
		return new Expression(
			new Exponent(
				shorthandToExpression(shorthand[0]),
				shorthandToExpression(shorthand[2]),
			),
		);
	}
	const isSum = shorthand[0] === '+';
	const expressions = (isSum ? shorthand.slice(1) : shorthand).map((x) =>
		shorthandToExpression(x),
	);
	return isSum
		? new Expression(new Sum(...expressions))
		: new Expression(new Product(...expressions));
}

/**
 * @param {ExpressionNode} exp
 * @param {SimplifyOptions} [options]
 * @returns {ExpressionNode}
 */
function simplify_to_different_node(exp, options) {
	if (exp.type === 'sum') {
		if (exp.terms.length === 0) {
			return new Numeral(0);
		} else if (exp.terms.length === 1) {
			return /** @type {Expression} */ (exp.terms[0]).node;
		} else {
			return combine_like_terms(exp, options);
		}
	} else if (exp.type === 'product') {
		if (exp.factors.length === 0) {
			return exp.coeff;
		} else if (exp.coeff.is.zero()) {
			return new Numeral(0);
		} else if (arrayHasLengthEqualTo(exp.factors, 1) && exp.coeff.is.one()) {
			return exp.factors[0].node;
		} else if (
			exp.coeff.is.negative() &&
			exp.factors.length === 1 &&
			exp.factors[0]?.is.negative() &&
			exp.factors[0]?.node.type === 'sum'
		) {
			return new Product(
				exp.coeff.abs(),
				new Expression(exp.factors[0].node.negative(options)),
			).simplify(options);
		} else {
			// special case for negative coefficients with quotients
			// simplify - (-2x/3) and - ( (-2x-1) / 3 )
			// simplify - ( a-b ) / 3 and - (b - a ) / 3
			if (
				exp.coeff.is.negative() &&
				arrayHasLengthEqualTo(exp.factors, 1) &&
				exp.factors[0].node.type === 'quotient'
			) {
				const quotient = exp.factors[0].node;
				const num = quotient.num;
				const den = quotient.den;
				if (num.is.negative()) {
					return new Product(
						exp.coeff.abs(),
						new Expression(new Quotient(num.negative(), den.clone())),
					).simplify(options);
				} else if (num.node.type === 'sum') {
					const terms = num._getSumTerms();
					if (arrayHasLengthEqualTo(terms, 2)) {
						const [t1, t2] = terms;
						if (t1.is.negative()) {
							// t2 must be positive or we will have been in earlier case
							return new Product(
								exp.coeff.abs(),
								new Expression(
									new Quotient(
										new Expression(new Sum(t1.negative(), t2.negative())),
										den.clone(),
									),
								),
							);
						} else if (t2.is.negative()) {
							// - (a-b) becomes b-a
							return new Product(
								exp.coeff.abs(),
								new Expression(
									new Quotient(
										new Expression(new Sum(t2.negative(), t1.negative())),
										den.clone(),
									),
								),
							);
						}
					}
				}
			}
			const node = combine_factors(exp);
			// special case containing quotients: k*f(x)*(g(x)/h(x)) becomes (k*f(x)*g(x)) / h(x)
			if (
				node.type === 'product' &&
				node.factors.some((factor) => factor.node.type === 'quotient') &&
				!(node.factors.length === 1 && node.coeff.is.negative_one())
			) {
				/** @type {Expression[]} */
				const nums = [];
				/** @type {Expression[]} */
				const dens = [];
				for (const factor of node.factors) {
					if (factor.node.type === 'quotient') {
						nums.push(factor.node.num);
						dens.push(factor.node.den);
					} else {
						nums.push(factor);
					}
				}
				const coeffNum = node.coeff.number.num;
				const coeffDen = node.coeff.number.den;
				return new Quotient(
					new Expression(new Product(coeffNum, ...nums)),
					new Expression(new Product(coeffDen, ...dens)),
				).simplify(options);
				//new Expression([
				//	new Expression([coeffNum, ...nums]),
				//	'/',
				//	new Expression([coeffDen, ...dens]),
				//]).simplify(options).node;
			}
			return node;
		}
	} else if (exp.type === 'quotient') {
		if (exp.num.node.type === 'numeral' && exp.num.node.number.is.zero()) {
			// zero numerator
			return new Numeral(0);
		} else if (
			exp.den.node.type === 'numeral' &&
			exp.den.node.number.is.one()
		) {
			// one denominator
			return exp.num.node;
		} else if (
			exp.num.node.type === 'numeral' &&
			exp.den.node.type === 'numeral'
		) {
			// both numerator and denominator are numerals: change to fraction
			return exp.num.node.divide(exp.den.node);
		} else if (
			(exp.num.node.type === 'numeral' || exp.num.node.type === 'product') &&
			exp.num.node.is.negative()
		) {
			// hoist negative
			if (
				(exp.den.node.type === 'numeral' || exp.den.node.type === 'product') &&
				exp.den.node.is.negative()
			) {
				return new Quotient(exp.num.negative(), exp.den.negative());
			}
			return new Product(
				-1,
				new Expression(new Quotient(exp.num.negative(), exp.den.clone())),
			).simplify(options);
		} else if (
			(exp.den.node.type === 'numeral' || exp.den.node.type === 'product') &&
			exp.den.node.is.negative()
		) {
			// hoist negative
			return new Product(
				new Expression(-1),
				new Expression(new Quotient(exp.num.clone(), exp.den.negative())),
			).simplify(options);
		}
	} else if (exp.type === 'exponent') {
		if (
			exp.base.node.type === 'numeral' &&
			exp.power.node.type === 'numeral' &&
			exp.power.node.number.is.integer()
		) {
			return new Numeral(exp.base.node.number.pow(exp.power.node.number));
		} else if (
			exp.power.node.type === 'numeral' &&
			exp.power.node.number.is.zero()
		) {
			return new Numeral(1);
		} else if (exp.power.node.type === 'numeral' && exp.power.node.is.one()) {
			return exp.base.node;
		} else if (exp.base.node.type === 'numeral' && exp.base.node.is.zero()) {
			return new Numeral(0);
		} else if (
			exp.power.node.type === 'numeral' &&
			exp.power.node.is.positive() &&
			exp.base.node.type === 'product'
		) {
			// exponent of product changed to product of exponents
			/** @type {Expression[]} */
			const factors = [];
			for (const factor of exp.base.node.factors) {
				factors.push(
					new Expression(
						new Exponent(factor, new Expression(exp.power.clone())),
					).simplify(options),
				);
			}
			return new Product(
				new Expression(exp.base.node.coeff.pow(exp.power.node)),
				...factors,
			);
		} else if (
			exp.power.node.type === 'numeral' &&
			exp.power.node.is.positive() &&
			exp.power.node.is.integer() &&
			exp.base.node.type === 'quotient'
		) {
			const num = new Expression([
				exp.base.node.num,
				'^',
				exp.power.node,
			]).simplify(options);
			const den = new Expression([
				exp.base.node.den,
				'^',
				exp.power.node,
			]).simplify(options);
			return new Quotient(num, den).simplify(options);
		}
	}
	return exp;
}

/**
 * @param {Expression} expression
 * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
 * @param {{verbatim?: boolean|'quotient'}} [options] - default to automatic simplification
 * @returns {Expression}
 */
function sub_in(expression, scope, options) {
	const scope_exp = resolve_scope(scope);
	/** @type {Expression} */
	let exp;
	if (expression.node.type === 'variable') {
		const name = expression.node.name;
		const val = scope_exp[name];
		if (val) {
			exp = val.clone();
		} else {
			exp = expression.clone();
		}
	} else {
		exp = new Expression(
			expression.node.subIn(scope_exp, { verbatim: false, ...options }),
		);
	}
	return exp.simplify(options);
}

/**
 * @param {Object.<string, Shorthand>} scope - variables to be replaced in the expression
 * @returns {Object.<string,Expression>}
 */
function resolve_scope(scope) {
	/** @type {Object.<string,Expression>} */
	const scope_exp = {};
	for (const [key, value] of Object.entries(scope)) {
		scope_exp[key] = shorthandToExpression(value);
	}
	return scope_exp;
}

/**
 * expands either products, products within a sum/quotient, or exponents with positive integral powers
 * @param {Expression} expression
 * @param {ExpansionOptions} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
 * @returns {Expression}
 */
function expand_expression(expression, options) {
	const node = expression.node;
	if (node.type === 'product') {
		const factors = node.factors.map((factor) =>
			expand_expression(factor, options),
		);
		const newProduct = new Expression(
			new Product(node.coeff, ...factors),
		).simplify(options);
		return expand_product(newProduct, options);
	} else if (node.type === 'sum') {
		const terms = node.terms.map((term) => expand_expression(term, options));
		const newSum = new Sum(...terms);
		newSum._flatten();
		return new Expression(newSum).simplify(options);
	} else if (node.type === 'quotient') {
		const num = expand_expression(node.num, options);
		const den = options?.numeratorOnly
			? node.den.clone()
			: expand_expression(node.den, options);
		return new Expression(new Quotient(num, den)).simplify(options);
	} else if (
		node.type === 'exponent' &&
		node.power.node.type === 'numeral' &&
		node.power.node.is.integer() &&
		node.power.node.is.positive() &&
		node.base.node.type === 'sum'
	) {
		if (options?.onlyLinear) {
			const base = expand_expression(node.base, options);
			return new Expression([base, '^', node.power]).simplify(options);
		}
		return expand_product(
			new Expression(
				new Product(
					...Array.from({ length: node.power.node.valueOf() }, () =>
						node.base.clone(),
					),
				),
			),
			options,
		);
	} else if (node.type === 'exponent') {
		const base = expand_expression(node.base, options);
		const power = expand_expression(node.power, options);
		return new Expression([base, '^', power]).simplify(options);
	} else {
		return expression.clone();
	}
}

/**
 * @param {Expression} expression
 * @param {ExpansionOptions} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
 * @returns {Expression}
 */
function expand_product(expression, options) {
	const exp = expression.node;
	if (!(exp.type === 'product')) return expression.clone();
	/** @type {Sum[]} */
	const sums = [];
	/** @type {Expression[]} */
	const others = [];
	for (const term of exp.factors) {
		if (term.node.type === 'sum') {
			sums.push(term.node);
		} else {
			others.push(term);
		}
	}
	if (
		sums.length === 0 ||
		(sums.length === 1 && exp.coeff.is.one() && exp.factors.length === 1)
	)
		return expression.clone().simplify(options);
	/** @type {Product[]} */
	let terms = /** @type {Sum} */ (sums[0]).terms.map((term) => {
		return new Product(
			new Expression(new Product(exp.coeff, ...others, term)).simplify(options),
		);
	});
	sums.shift();
	for (const sum of sums) {
		/** @type {Product[]} */
		const new_terms = [];
		for (const term of terms) {
			for (const t of sum.terms) {
				new_terms.push(
					new Product(term.coeff, ...term.factors, t).simplify(options),
				);
			}
		}
		terms = new_terms;
	}
	const termsExp = terms.map((term) => new Expression(term).simplify(options));
	const sum = new Sum(...termsExp).simplify(options);
	sum._flatten();
	return new Expression(sum).simplify(options);
}

/**
 * combine like terms
 * @param {Sum} sum
 * @param {SimplifyOptions} [options]
 * @returns {ExpressionNode}
 */
function combine_like_terms(sum, options) {
	// lexical string: [indices, coeff, expression]
	/** @type {Object.<string,[number[],Numeral,Expression]>} */
	const termMap = {};
	/** @type {string[]} */
	const orderedKeys = [];
	// run through terms to collect the coefficients
	for (const [i, term] of sum.terms.entries()) {
		const key =
			term.node.type === 'numeral'
				? 'numeral'
				: term.node._to_lexical_string({ coeff: false });
		const val = termMap[key];
		if (val) {
			val[0].push(i);
			if (term.node.type === 'product') {
				val[1] = val[1].plus(term.node.coeff);
			} else if (term.node.type === 'numeral') {
				val[1] = val[1].plus(term.node.number);
			} else {
				val[1] = val[1].plus(1);
			}
		} else {
			orderedKeys.push(key);
			if (term.node.type === 'product') {
				termMap[key] = [
					[i],
					term.node.coeff,
					term.node.factors.length === 0
						? new Expression(1)
						: new Expression(new Product(...term.node.factors)),
				];
			} else if (term.node.type === 'numeral') {
				termMap[key] = [[i], term.node.clone(), new Expression(1)];
			} else {
				termMap[key] = [[i], new Numeral(1), term.clone()];
			}
		}
	}
	/** @type {number[]} */
	const indicesToRemove = [];
	const terms = sum.terms.map((term) => term.clone());
	for (const key of orderedKeys) {
		const [indices, coeff, expression] =
			/** @type {[number[], Numeral, Expression]} */ (termMap[key]);
		if (indices.length > 1) {
			const firstIndex = /** @type {number} */ (indices[0]);
			if (key === 'numeral') {
				/** @type {Expression} */ (terms[firstIndex]).node = coeff;
				if (coeff.is.zero()) indicesToRemove.push(firstIndex);
			} else {
				/** @type {Expression} */ (terms[firstIndex]).node = new Product(
					coeff,
					expression,
				).simplify(options);
				if (coeff.is.zero()) indicesToRemove.push(firstIndex);
			}
			indicesToRemove.push(...indices.slice(1));
		}
	}
	const finalTerms = terms.filter((_, i) => !indicesToRemove.includes(i));

	return finalTerms.length === 0
		? new Numeral(0)
		: finalTerms.length === 1
			? /** @type {Expression} */ (finalTerms[0]).simplify(options).node
			: new Sum(...finalTerms).simplify(options);
}

/**
 * extracts numeric factors into coefficient
 * combines singletons and exponents with numeric powers into an exponent
 * eg. combines $4 \cdot x \cdot x^2 \cdot 3$ into $12x^3$
 * @param {Product} product
 * @returns {Product|ExpressionNode}
 */
function combine_factors(product) {
	// lexical string: [indices, power, base expression]
	/** @type {Record.<string,[number[],Numeral,Expression]>} */
	const termMap = {};
	/** @type {string[]} */
	const orderedKeys = [];
	/** @type {number[]} */
	const indicesToRemove = [];
	let coeff = product.coeff.clone();
	for (const [i, factor] of product.factors.entries()) {
		if (
			factor.node.type === 'exponent' &&
			factor.node.power.node.type === 'numeral'
		) {
			const key = factor.node.base._to_lexical_string();
			const val = termMap[key];
			if (val) {
				val[0].push(i);
				val[1] = val[1].plus(factor.node.power.node);
			} else {
				orderedKeys.push(key);
				termMap[key] = [[i], factor.node.power.node, factor.node.base.clone()];
			}
		} else if (factor.node.type === 'numeral') {
			// extracts numeric factors into coefficient
			coeff = coeff.times(factor.node);
			indicesToRemove.push(i);
		} else {
			const key = factor._to_lexical_string();
			const val = termMap[key];
			if (val) {
				val[0].push(i);
				val[1] = val[1].plus(1);
			} else {
				orderedKeys.push(key);
				termMap[key] = [
					[i],
					new Numeral(1),
					/** @type {Expression} */ (product.factors[i]),
				];
			}
		}
	}
	const factors = product.factors.map((factor) => factor.clone());
	for (const key of orderedKeys) {
		const [indices, power, base] =
			/** @type {[number[],Numeral,Expression]} */ (termMap[key]);
		if (indices.length > 1) {
			// combine
			if (power.is.zero()) {
				indicesToRemove.push(...indices);
			} else {
				const newExponent = power.is.one()
					? base
					: new Expression(new Exponent(base, new Expression(power)));
				factors[/** @type {number} */ (indices[0])] = newExponent;
				indicesToRemove.push(...indices.slice(1));
			}
		}
	}
	const finalFactors = factors.filter((_, i) => !indicesToRemove.includes(i));
	return finalFactors.length === 0
		? coeff
		: coeff.is.zero()
			? new Numeral(0)
			: finalFactors.length === 1 && coeff.is.one()
				? /** @type {Expression} */ (finalFactors[0]).node
				: new Product(coeff, ...finalFactors);
}

/**
 * get gcd of two expressions
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @returns {Expression}
 */
function expression_gcd_two(exp1, exp2) {
	const a = exp1.node;
	const b = exp2.node;
	// exponent with numeral power with exponent
	// exponent with numeral power with product
	// product with product
	// product with numeral
	if (a.type === 'exponent' && a.power.node.type === 'numeral') {
		if (b.type === 'exponent' && b.power.node.type === 'numeral') {
			if (a.base._to_lexical_string() === b.base._to_lexical_string()) {
				return new Expression(
					new Exponent(
						a.base.clone(),
						new Expression(Numeral.min(a.power.node, b.power.node)),
					),
				);
			}
			return new Expression(new Numeral(1));
		} else if (b.type === 'product') {
			for (const factor of b.factors) {
				if (
					factor.node.type === 'exponent' &&
					factor.node.power.node.type === 'numeral'
				) {
					if (
						factor.node.base._to_lexical_string() ===
						a.base._to_lexical_string()
					) {
						return new Expression(
							new Exponent(
								a.base.clone(),
								new Expression(
									Numeral.min(a.power.node, factor.node.power.node),
								),
							),
						);
					}
				} else if (
					factor._to_lexical_string() === a.base._to_lexical_string()
				) {
					return new Expression(
						new Exponent(
							a.base.clone(),
							new Expression(Numeral.min(a.power.node, 1)),
						),
					).simplify();
				}
			}
			return new Expression(new Numeral(1));
		} else {
			if (a.base._to_lexical_string() == exp2._to_lexical_string()) {
				return new Expression(
					new Exponent(
						a.base.clone(),
						new Expression(Numeral.min(a.power.node, 1)),
					),
				).simplify();
			}
			return new Expression(new Numeral(1));
		}
	} else if (a.type === 'product') {
		if (b.type === 'exponent' && b.power.node.type === 'numeral') {
			return expression_gcd_two(exp2, exp1);
		} else if (b.type === 'product') {
			// lexical string: [power, expression, modified?]
			/** @type {Object.<string,[Numeral,Expression,true?]>} */
			const termMap = {};
			/** @type {string[]} */
			const orderedKeys = [];
			// loop through a
			for (const factor of a.factors) {
				if (
					factor.node.type === 'exponent' &&
					factor.node.power.node.type === 'numeral'
				) {
					const key = factor.node.base._to_lexical_string();
					orderedKeys.push(key);
					termMap[key] = [factor.node.power.node, factor.node.base.clone()];
				} else {
					const key = factor._to_lexical_string();
					orderedKeys.push(key);
					termMap[key] = [new Numeral(1), new Expression(factor.clone())];
				}
			}
			// loop through b
			for (const factor of b.factors) {
				if (
					factor.node.type === 'exponent' &&
					factor.node.power.node.type === 'numeral'
				) {
					const key = factor.node.base._to_lexical_string();
					const val = termMap[key];
					if (val) {
						val[0] = Numeral.min(factor.node.power.node, val[0]);
						val[2] = true;
					}
				} else {
					const key = factor._to_lexical_string();
					const val = termMap[key];
					if (val) {
						val[0] = Numeral.min(1, val[0]);
						val[2] = true;
					}
				}
			}
			for (const [key, val] of Object.entries(termMap)) {
				if (val[2] === undefined) {
					// no-dynamic-delete
					// eslint-disable-next-line
					delete termMap[key];
				}
			}
			/** @type {Expression[]} */
			const factors = [];
			for (const key of orderedKeys) {
				const val = termMap[key];
				if (val) {
					const [power, expression] = val;
					if (power.is.one()) {
						factors.push(expression);
					} else if (power.is.nonzero()) {
						factors.push(
							new Expression(new Exponent(expression, new Expression(power))),
						);
					}
				}
			}
			let numericalGcd = Numeral.gcd(a.coeff, b.coeff);
			if (a.coeff.is.negative() && b.coeff.is.negative())
				numericalGcd = numericalGcd.negative();
			return new Expression(
				new Product(new Expression(numericalGcd), ...factors),
			).simplify();
		} else if (b.type === 'numeral') {
			const gcd = Numeral.gcd(a.coeff, b);
			return new Expression(
				a.coeff.is.negative() && b.is.negative() ? gcd.negative() : gcd,
			);
		} else {
			for (const factor of a.factors) {
				if (
					factor.node.type === 'exponent' &&
					factor.node.power.node.type === 'numeral'
				) {
					if (
						factor.node.base._to_lexical_string() === b._to_lexical_string()
					) {
						return new Expression(factor.node.base.clone());
					}
				} else if (factor._to_lexical_string() === b._to_lexical_string()) {
					return new Expression(factor.clone());
				}
			}
			return new Expression(new Numeral(1));
		}
	} else if (
		(b.type === 'exponent' && b.power.node.type === 'numeral') ||
		b.type === 'product'
	) {
		return expression_gcd_two(exp2, exp1);
	} else {
		if (exp1._to_lexical_string() === exp2._to_lexical_string()) {
			return exp1.clone();
		}
		return new Expression(new Numeral(1));
	}
}

/**
 *
 * @param {Expression[]} exps
 * @returns {Expression}
 */
export function expression_gcd(...exps) {
	if (exps.length === 0) {
		throw new Error('Cannot find gcd of empty array');
	} else if (exps.length === 1) {
		return /** @type {Expression} */ (exps[0]).clone();
	} else if (exps.length === 2) {
		return expression_gcd_two(
			/** @type {Expression} */ (exps[0]),
			/** @type {Expression} */ (exps[1]),
		);
	}
	// more than 2 expressions
	let gcd = expression_gcd_two(
		/** @type {Expression} */ (exps[0]),
		/** @type {Expression} */ (exps[1]),
	);
	exps.shift();
	exps.shift();
	for (const exp of exps) {
		gcd = expression_gcd_two(gcd, exp);
	}
	return gcd;
}

/**
 * divides a product, assuming that the divisor is a factor of the product
 * @param {Expression} expression
 * @param {ExpressionNode} divisor
 * @returns {Product} - quotient as simplified product
 */
function divide_by_factor(expression, divisor) {
	if (expression.node.type === 'numeral') {
		if (divisor.type !== 'numeral')
			throw new TypeError('numeral can only be divided by numeral');
		return new Product(new Expression(expression.node.divide(divisor)));
	}
	const expressionProduct =
		expression.node.type === 'product'
			? expression.node.clone()
			: new Product(expression.clone());
	if (divisor.type === 'numeral') {
		return new Product(
			new Expression(expressionProduct.coeff.divide(divisor)),
			...expressionProduct.factors.map((f) => f.clone()),
		);
	} else if (divisor.type === 'exponent') {
		/** @type {Expression[]} */
		const factors = [];
		for (const expressionFactor of expressionProduct.factors) {
			if (
				expressionFactor.node.type === 'exponent' &&
				expressionFactor.node.base._to_lexical_string() ===
					divisor.base._to_lexical_string() &&
				expressionFactor.node.power.node.type === 'numeral' &&
				divisor.power.node.type === 'numeral'
			) {
				factors.push(
					new Expression(
						new Exponent(
							expressionFactor.node.base.clone(),
							new Expression(
								expressionFactor.node.power.node.minus(divisor.power.node),
							),
						),
					),
				);
			} else if (
				expressionFactor._to_lexical_string() ===
					divisor.base._to_lexical_string() &&
				divisor.power.node.type === 'numeral'
			) {
				factors.push(
					new Expression(
						new Exponent(
							expressionFactor.clone(),
							new Expression(new Numeral(1).minus(divisor.power.node)),
						),
					),
				);
			} else {
				factors.push(expressionFactor);
			}
		}
		return new Product(new Expression(expressionProduct.coeff), ...factors);
	} else if (divisor.type === 'product') {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of expressionProduct.factors) {
			let divided = false;
			if (
				factor.node.type === 'exponent' &&
				factor.node.power.node.type === 'numeral'
			) {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor.node.type === 'exponent' &&
						divisorFactor.node.base._to_lexical_string() ===
							factor.node.base._to_lexical_string() &&
						divisorFactor.node.power.node.type === 'numeral'
					) {
						factors.push(
							new Expression(
								new Exponent(
									factor.node.base,
									new Expression(
										factor.node.power.node.minus(divisorFactor.node.power.node),
									),
								),
							),
						);
						divided = true;
						break;
					} else if (
						divisorFactor._to_lexical_string() ===
						factor.node.base._to_lexical_string()
					) {
						factors.push(
							new Expression(
								new Exponent(
									factor.node.base.clone(),
									new Expression(factor.node.power.minus(1)),
								),
							),
						);
						divided = true;
						break;
					}
				}
			} else {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor.node.type === 'exponent' &&
						factor.node._to_lexical_string() ===
							divisorFactor.node.base._to_lexical_string() &&
						divisorFactor.node.power.node.type === 'numeral'
					) {
						factors.push(
							new Expression(
								new Exponent(
									factor.clone(),
									new Expression(
										new Numeral(1).minus(divisorFactor.node.power.node),
									),
								),
							),
						);
						divided = true;
						break;
					} else if (
						factor.node._to_lexical_string() ===
						divisorFactor._to_lexical_string()
					) {
						divided = true;
						break;
					}
				}
			}
			if (!divided) {
				factors.push(factor);
			}
		}
		return new Product(
			new Expression(expressionProduct.coeff.divide(divisor.coeff)),
			...factors,
		);
	} else {
		/** @type {Expression[]} */
		const factors = [];
		let haveDivided = false;
		for (const factor of expressionProduct.factors) {
			if (
				factor.node.type === 'exponent' &&
				factor.node.base._to_lexical_string() ===
					divisor._to_lexical_string() &&
				factor.node.power.node.type === 'numeral'
			) {
				haveDivided = true;
				factors.push(
					new Expression(
						new Exponent(
							factor.node.base,
							new Expression(factor.node.power.node.minus(1)),
						),
					),
				);
			} else if (factor._to_lexical_string() !== divisor._to_lexical_string()) {
				factors.push(new Expression(factor));
			} else {
				// remaining case: if factor = divisor, will be divided out, so no need to include in factors
				haveDivided = true;
			}
		}
		if (!haveDivided) throw new Error('did not find factor to divide out');
		return new Product(new Expression(expressionProduct.coeff), ...factors);
	}
}

/**
 * Creates an simplified Expression instance representing a sum
 * @param {Shorthand[]} terms
 * @returns {Expression}
 */
export function sum(...terms) {
	return sumVerbatim(...terms).simplify();
}
/**
 * Creates an Expression instance representing a sum
 * @param {Shorthand[]} terms
 * @returns {Expression}
 */
export function sumVerbatim(...terms) {
	return new Expression(['+', ...terms]);
}

/**
 * Creates an Expression instance representing a quotient
 * @param {Shorthand} numerator
 * @param {Shorthand} denominator
 * @param {SimplifyOptions} [options]
 * @returns {Expression}
 */
export function quotient(numerator, denominator, options) {
	return new Expression([numerator, '/', denominator]).simplify(options);
}

/**
 * Creates an Expression instance representing a quotient
 * @param {Shorthand} power
 * @returns {Expression}
 */
export function expTerm(power) {
	return new Expression([e, '^', power]).simplify();
}

export const e = new Variable('e', {
	constantValue: Math.E,
	typesetString: '\\mathrm{e}',
});
export const i = new Variable('i', {
	typesetString: '\\mathrm{i}',
});
export const pi = new Variable('pi', {
	constantValue: Math.PI,
	typesetString: '\\pi ',
});

/**
 *
 * @param {string} functionName
 * @param {Shorthand} argument
 * @returns {Expression}
 */
export function fnTerm(functionName, argument) {
	const arg = new Expression(argument);
	return new Expression(new Fn(arg, { functionName })).simplify();
}
