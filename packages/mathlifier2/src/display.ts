/**
 * Renders displayed math
 *
 * Takes a TeX expression and outputs a string with the $$...$$ delimiters
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 * @returns $$x$$
 *
 */
export function display(x: string, options?: any) {
	return `$$${x}$$`;
}
