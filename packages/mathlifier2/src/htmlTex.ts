/**
 * custom html is not executed latex-side.
 * to be used in conjunction with mathlifier
 */
export function html(x: string): string {
	return '';
}

/**
 * custom latex is injected
 * to be used in conjunction with mathlifier
 */
export function tex(x: string): string {
	return x;
}

/**
 * inject the relevant latex
 * to be used in conjunction with mathlifier
 */
export function htmlTex(x: string, y: string): string {
	return y;
}
