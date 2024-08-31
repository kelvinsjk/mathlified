import { Variable } from '../core/expression/expression.js';

/**
 * @param {string} variable
 * @returns {Variable}
 */
export function greek(variable) {
	return new Variable(variable, { typesetString: `\\${variable} ` });
}
