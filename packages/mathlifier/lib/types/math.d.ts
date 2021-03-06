/**
 * Renders inline math
 *
 * Takes a TeX expression and outputs a HTML string for the rendered math
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{wrap: false, throwOnError: false}`.
 * `wrap` is a custom option where the default `wrap===false` disables line breaks by default by adding braces to the TeX expression.
 * All KaTeX options are supported, and with the exception of `throwOnError` are left as default
 *
 * @returns HTML string generated by KaTeX representing inline math
 *
 * With default options, is equivalent to calling `katex.renderToString('{'+x+'}', {throwOnError: false})
 */
export declare function math(x: string, options?: KatexOptionsInline): string;
import { KatexOptions } from "./interface";
interface KatexOptionsInline extends KatexOptions {
    /** whether to wrap LaTeX markup with curly braces to prevent line-wrap */
    wrap?: boolean;
}
export {};
