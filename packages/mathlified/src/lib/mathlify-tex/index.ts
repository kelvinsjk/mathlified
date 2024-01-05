import { mathlifyGen } from '../core/';

const modules = {
	math,
	display,
	em,
	b,
	br,
	hr,
	mathEnvs: {
		equation: mathEnvironmentGenerator('equation'),
		align: mathEnvironmentGenerator('align'),
		gather: mathEnvironmentGenerator('gather'),
		alignat: alignatGenerator(false),
		equationStar: mathEnvironmentGenerator('equation*'),
		alignStar: mathEnvironmentGenerator('align*'),
		gatherStar: mathEnvironmentGenerator('gather*'),
		alignatStar: alignatGenerator(true),
	},
};

/**
 * math: starts with ${}, terminates with \n,
 * display: starts with $${}, terminates with \n\n,
 * text: starts with @${}, terminates with \n
 */
export function mathlifyTex(strings: TemplateStringsArray, ...values: unknown[]): string {
	return mathlifyGen(modules)(strings, ...values);
}

function math(x: string): string {
	return `$${x}$`;
}
function display(x: string): string {
	return `$$ ${x} $$`;
}
function em(x: string): string {
	return `\\emph{${x}}`;
}
function b(x: string): string {
	return `\\textbf{${x}}`;
}
function br(): string {
	return `\\newline `;
}
function hr(): string {
	return `\\hrule `;
}
function mathEnvironmentGenerator(env: string): (x: string) => string {
	return (x: string) => {
		return `\\begin{${env}}${x}\n\\end{${env}}`;
	};
}
function alignatGenerator(star: boolean): (eqnColumns: number, x: string) => string {
	return (eqnColumns: number, x: string) => {
		const asterisk = star ? '*' : '';
		return `\\begin{alignat${asterisk}}{${eqnColumns}}${x}\n\\end{alignat${asterisk}}`;
	};
}
