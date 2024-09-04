export {
	Expression,
	Variable,
	Numeral,
	sum,
	sumVerbatim,
	quotient,
	expTerm,
	fnTerm,
	e,
	pi,
	i,
} from './core/expression/expression.js';
export { greek } from './utils/greek-variable.js';
export { Polynomial } from './core/polynomial/index.js';
export { expressionToPolynomial } from './utils/expression-to-polynomial.js';
/** @typedef {import('./core/expression/expression.js').Shorthand} Shorthand */