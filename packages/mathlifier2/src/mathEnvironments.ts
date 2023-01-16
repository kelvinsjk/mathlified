import outdent from 'outdent';

/**
 * Renders align environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function align(x: string, options?: any) {
	return displayEnvironment('align', x);
}

/**
 * Renders align* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function alignStar(x: string, options?: any) {
	return displayEnvironment('align*', x);
}

/**
 * Renders alignat environment
 *
 * @param x TeX expression to be rendered
 * @param pairs number of r/l column pairs
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function alignat(x: string, pairs: number, options?: any) {
	return displayEnvironment('alignat', x, { postBegin: `{${pairs}}` });
}

/**
 * Renders alignat* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function alignatStar(x: string, pairs: number, options?: any) {
	return displayEnvironment('alignat*', x, { postBegin: `{${pairs}}` });
}

/**
 * Renders gather environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function gather(x: string, options?: any) {
	return displayEnvironment('gather', x);
}

/**
 * Renders gather* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function gatherStar(x: string, options?: any) {
	return displayEnvironment('gather*', x, options);
}

/**
 * Renders equation* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function equationStar(x: string, options?: any) {
	return displayEnvironment('equation*', x, options);
}
/**
 * Renders equation environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export function equation(x: string, options?: any) {
	return displayEnvironment('equation', x, options);
}
export const eqn = equation;
export const eqnStar = equationStar;

function displayEnvironment(
	env: string,
	x: string,
	options?: {
		postBegin?: string;
	},
) {
	return outdent`
	\\begin{${env}}${options?.postBegin ?? ''}
		${x}
	\\end{${env}}`;
}
