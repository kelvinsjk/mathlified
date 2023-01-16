export const linebreak = '\\linebreak ';
export const newline = '\\newline ';

export function bold(x: string): string {
	return `\\textbf{${x}}`;
}
export const strong = bold;
export function emph(x: string): string {
	return `\\emph{${x}}`;
}
export const em = emph;

export const newParagraph = `\n\n`;
