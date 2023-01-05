import { display, type KatexOptionsDisplay } from "./display";

/**
 * Renders align environment in displayed mode
 *
 * Takes a TeX expression and outputs a HTML string for the rendered math in displayed mode
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{overflowAuto: true, throwOnError: false}`.
 * overflowAuto is a custom option where the default `overflowAuto===true` wraps the generated HTML in a container with `style="overflow-x:auto;"`
 * All KaTeX options are supported, and with the exception of `throwOnError` and `displayMode` are left as default
 *
 * @returns HTML string generated by KaTeX representing displayed math
 *
 * With default options, is equivalent to
 * wrapping x with `\\begin{align} ... \\end{align}`, calling
 * `katex.renderToString(x, {throwOnError: false, displayMode: true})
 * and wrapping it in a container with `style="overflow-x:auto;"`
 */
export function align(x: string, options?: KatexOptionsDisplay) {
  options = {
    overflowAuto: true,
    throwOnError: false,
    displayMode: true,
    ...options,
  };
  return displayEnvironment("align", x, options);
}

/**
 * Renders align* environment in displayed mode
 *
 * Takes a TeX expression and outputs a HTML string for the rendered math in displayed mode
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{overflowAuto: true, throwOnError: false}`.
 * overflowAuto is a custom option where the default `overflowAuto===true` wraps the generated HTML in a container with `style="overflow-x:auto;"`
 * All KaTeX options are supported, and with the exception of `throwOnError` and `displayMode` are left as default
 *
 * @returns HTML string generated by KaTeX representing displayed math
 *
 * With default options, is equivalent to
 * wrapping x with `\\begin{align*} ... \\end{align*}`, calling
 * `katex.renderToString(x, {throwOnError: false, displayMode: true})
 * and wrapping it in a container with `style="overflow-x:auto;"`
 */
export function alignStar(x: string, options?: KatexOptionsDisplay) {
  options = {
    overflowAuto: true,
    throwOnError: false,
    displayMode: true,
    ...options,
  };
  return displayEnvironment("align*", x, options);
}

/**
 * Renders gather environment in displayed mode
 *
 * Takes a TeX expression and outputs a HTML string for the rendered math in displayed mode
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{overflowAuto: true, throwOnError: false}`.
 * overflowAuto is a custom option where the default `overflowAuto===true` wraps the generated HTML in a container with `style="overflow-x:auto;"`
 * All KaTeX options are supported, and with the exception of `throwOnError` and `displayMode` are left as default
 *
 * @returns HTML string generated by KaTeX representing displayed math
 *
 * With default options, is equivalent to
 * wrapping x with `\\begin{gather} ... \\end{gather}`, calling
 * `katex.renderToString(x, {throwOnError: false, displayMode: true})
 * and wrapping it in a container with `style="overflow-x:auto;"`
 */
export function gather(x: string, options?: KatexOptionsDisplay) {
  options = {
    overflowAuto: true,
    throwOnError: false,
    displayMode: true,
    ...options,
  };
  return displayEnvironment("gather", x, options);
}

/**
 * Renders gather* environment in displayed mode
 *
 * Takes a TeX expression and outputs a HTML string for the rendered math in displayed mode
 *
 * @param x TeX expression to be rendered
 * @param options defaults to `{overflowAuto: true, throwOnError: false}`.
 * overflowAuto is a custom option where the default `overflowAuto===true` wraps the generated HTML in a container with `style="overflow-x:auto;"`
 * All KaTeX options are supported, and with the exception of `throwOnError` and `displayMode` are left as default
 *
 * @returns HTML string generated by KaTeX representing displayed math
 *
 * With default options, is equivalent to
 * wrapping x with `\\begin{gather*} ... \\end{gather*}`, calling
 * `katex.renderToString(x, {throwOnError: false, displayMode: true})
 * and wrapping it in a container with `style="overflow-x:auto;"`
 */
export function gatherStar(x: string, options?: KatexOptionsDisplay) {
  options = {
    overflowAuto: true,
    throwOnError: false,
    displayMode: true,
    ...options,
  };
  return displayEnvironment("gather*", x, options);
}

function displayEnvironment(
  env: string,
  x: string,
  options?: KatexOptionsDisplay
) {
  options = {
    overflowAuto: true,
    throwOnError: false,
    displayMode: true,
    ...options,
  };
  return display(
    `\\begin{${env}}
    ${x}
  \\end{${env}}`,
    options
  );
}