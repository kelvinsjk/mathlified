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
declare function math(x: string, options?: {
    wrap?: boolean;
}): string;

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
declare function display(x: string, options?: any): string;

/**
 * Renders align environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
declare function align(x: string, options?: any): string;
/**
 * Renders align* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
declare function alignStar(x: string, options?: any): string;
/**
 * Renders gather environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
declare function gather(x: string, options?: any): string;
/**
 * Renders gather* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
declare function gatherStar(x: string, options?: any): string;

declare const linebreak = "\\linebreak\n";
declare const newline = "\\newline\n";
declare function bold(x: string): string;
declare const strong: typeof bold;
declare function emph(x: string): string;
declare const em: typeof emph;
declare const newParagraph = "\n\n";

export { align, alignStar, bold, display, em, emph, gather, gatherStar, linebreak, math, newParagraph, newline, strong };
