/**
 * custom html is injected.
 * to be used in conjunction with mathlifier2
 */
export function html(x: string): string {
	return x;
}

/**
 * custom latex is removed for html purposes
 * to be used in conjunction with mathlifier2
 */
export function tex(x: string): string {
	return '';
}

/**
 * inject the relevant html
 * to be used in conjunction with mathlifier2
 */
export function htmlTex(x: string, y: string): string {
	return x;
}
