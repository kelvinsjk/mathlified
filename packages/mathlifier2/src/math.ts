/**
 * Renders inline math
 *
 * Takes a TeX expression and outputs a string with the $...$ delimiters
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{wrap: false}`.
 * `wrap` is a custom option where the default `wrap===false` disables line breaks by default by adding braces to the TeX expression.
 *
 * @returns $x$
 *
 */
export function math(x: string, options?: { wrap?: boolean }): string {
	options = { wrap: false, ...options };
	const xString = options.wrap ? x : `{${x}}`;
	return `$${xString}$`;
}
