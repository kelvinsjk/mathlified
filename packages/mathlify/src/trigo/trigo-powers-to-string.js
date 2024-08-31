import { Cos, Sin } from '../fns/index.js';
/** @typedef {import('../core/expression/expression.js').Expression} Expression */

/**
 * @param {Expression} exp
 * @returns {string|undefined}
 */
export const trigoPowersToStringFn = (exp) => {
	if (
		exp.node.type === 'exponent' &&
		(exp.node.base.node instanceof Cos || exp.node.base.node instanceof Sin)
	) {
		const trigoString = exp.node.base.toString();
		const powerString = exp.node.power.toString();
		const powerBrackets =
			powerString.length > 1 ? `{${powerString}}` : powerString;
		const replaceString = exp.node.base.node instanceof Cos ? '\\cos' : '\\sin';
		return trigoString.replace(
			replaceString,
			`${replaceString}^${powerBrackets}`,
		);
	}
	return undefined;
};
