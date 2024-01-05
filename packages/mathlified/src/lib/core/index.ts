enum Modes {
	text, // 0
	math, // 1
	display, // 2
	mathEnv, // 3
}

import type { Options } from 'temml';

export interface Modules {
	math: (x: string, options?: Options) => string;
	display: (x: string, options?: Options) => string;
	em?: (x: string) => string;
	b?: (x: string) => string;
	br?: () => string;
	hr?: () => string;
	postProcess?: (x: string) => string;
	mathEnvs?: {
		equation?: (x: string, options?: Options) => string;
		align?: (x: string, options?: Options) => string;
		gather?: (x: string, options?: Options) => string;
		alignat?: (eqnColumns: number, x: string, options?: Options) => string;
		equationStar?: (x: string, options?: Options) => string;
		alignStar?: (x: string, options?: Options) => string;
		gatherStar?: (x: string, options?: Options) => string;
		alignatStar?: (eqnColumns: number, x: string, options?: Options) => string;
	};
}

enum MathEnvs {
	equation,
	equationStar,
	align,
	alignStar,
	gather,
	gatherStar,
	alignat,
	alignatStar,
}

const envs: { [key: string]: MathEnvs } = {
	equation: MathEnvs.equation,
	'equation*': MathEnvs.equationStar,
	align: MathEnvs.align,
	'align*': MathEnvs.alignStar,
	gather: MathEnvs.gather,
	'gather*': MathEnvs.gatherStar,
	alignat: MathEnvs.alignat, // triggered by ~${alignat{x}}
	'alignat*': MathEnvs.alignatStar, // triggered by ~${alignat*{x}}
};

interface MathEnvOptions {
	mathEnv: MathEnvs;
	eqnColumns?: number;
}

export function mathlifyGen(
	modules: Modules,
): (strings: TemplateStringsArray, ...values: unknown[]) => string {
	return (strings: TemplateStringsArray, ...values: unknown[]) => {
		let curr = '';
		let acc = '';
		let mode = Modes.text;
		let options: Options = {};
		let mathEnvOptions = {
			mathEnv: MathEnvs.equation,
		};
		strings.forEach((str, i) => {
			const nextVal = values[i] ?? '';
			if (mode === Modes.text) {
				if (str.endsWith('@')) {
					curr += `${str.slice(0, str.length - 1)}${handleTextMode(`${nextVal}`, modules)}`;
				} else {
					// starts new environment
					[mode, acc, curr, mathEnvOptions] = startNewEnv(str, '', nextVal, curr, modules);
					options = {};
				}
			} else if (mode === Modes.math) {
				// checks for \n or \r\n non-greedily
				const regex = /([^]*?)(\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end math mode
					const [, before, newline, after] = match;
					acc += `${before}`;
					if (acc) {
						curr += modules.math(acc, options);
					}
					[mode, acc, curr, mathEnvOptions] = startNewEnv(after, newline, nextVal, curr, modules);
					options = {};
				} else {
					// continue math mode
					if (str.endsWith(`@`)) {
						// options
						options = nextVal;
						acc += `${str.slice(0, str.length - 1)}`;
					} else {
						acc += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						curr += modules.math(acc, options);
					}
				}
			} else if (mode === Modes.display) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end display mode
					const [, before, newline, after] = match;
					acc += before;
					if (acc) {
						curr += modules.display(acc, options);
					}
					[mode, acc, curr, mathEnvOptions] = startNewEnv(after, newline, nextVal, curr, modules);
					options = {};
				} else {
					// continue display mode
					if (str.endsWith(`@`)) {
						// options
						options = nextVal;
						acc += `${str.slice(0, str.length - 1)}`;
					} else {
						acc += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						curr += modules.display(acc, options);
					}
				}
			} else if (mode === Modes.mathEnv) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end mathEnv mode
					const [, before, newline, after] = match;
					acc += before;
					if (acc) {
						curr += insertMathEnv(mathEnvOptions, acc, options, modules);
					}
					[mode, acc, curr, mathEnvOptions] = startNewEnv(after, newline, nextVal, curr, modules);
					options = {};
				} else {
					// continue mathEnv mode
					if (str.endsWith(`@`)) {
						// options
						options = nextVal;
						acc += `${str.slice(0, str.length - 1)}`;
					} else {
						acc += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						curr += insertMathEnv(mathEnvOptions, acc, options, modules);
					}
				}
			}
		});
		// post process
		if (modules.postProcess) {
			curr = modules.postProcess(curr);
		}
		return curr;
	};
}

// returns [Mode, acc, curr, {mathEnv, eqnColumns?}]
function startNewEnv(
	after: string,
	newline: string,
	nextVal: unknown,
	curr: string,
	modules: Modules,
): [Modes, string, string, MathEnvOptions] {
	const defaultMathEnvOptions = { mathEnv: MathEnvs.equation };
	if (after.endsWith('$')) {
		// new display mode
		return [
			Modes.display,
			`${nextVal}`,
			curr + `${newline}${after.slice(0, after.length - 1)}`,
			defaultMathEnvOptions,
		];
	} else if (after.endsWith('@')) {
		// new text mode
		return [
			Modes.text,
			'',
			curr +
				`${newline}${after.slice(0, after.length - 1)}${handleTextMode(`${nextVal}`, modules)}`,
			defaultMathEnvOptions,
		];
	} else if (after.endsWith('~')) {
		// new math env
		let mathEnv = MathEnvs.equation;
		let eqnColumns: number | undefined = undefined;
		const nextValStr = `${nextVal}`;
		if (nextValStr.startsWith('alignat{') && nextValStr.endsWith('}')) {
			eqnColumns = parseInt(nextValStr.slice(8, nextValStr.length - 1));
			mathEnv = MathEnvs.alignat;
		} else if (nextValStr.startsWith('alignat*{') && nextValStr.endsWith('}')) {
			eqnColumns = parseInt(nextValStr.slice(9, nextValStr.length - 1));
			mathEnv = MathEnvs.alignatStar;
		} else {
			mathEnv = envs[nextValStr] ?? MathEnvs.equation;
		}
		return [
			Modes.mathEnv,
			'',
			curr + newline + after.slice(0, after.length - 1),
			{ mathEnv, eqnColumns },
		];
	} else {
		// new math mode
		return [Modes.math, `${nextVal}`, curr + newline + after, defaultMathEnvOptions];
	}
}

function handleTextMode(nextVal: string, modules: Modules): string {
	if (nextVal.startsWith('em{') && nextVal.endsWith('}')) {
		const emArg = nextVal.slice(3, nextVal.length - 1);
		return modules.em ? modules.em(emArg) : emArg;
	} else if (nextVal.startsWith('b{') && nextVal.endsWith('}')) {
		const bArg = nextVal.slice(2, nextVal.length - 1);
		return modules.b ? modules.b(bArg) : bArg;
	} else if (nextVal === '@br') {
		return modules.br ? modules.br() : nextVal;
	} else if (nextVal === '@hr') {
		return modules.hr ? modules.hr() : nextVal;
	} else {
		return nextVal;
	}
}

function insertMathEnv(
	mathEnvOptions: MathEnvOptions,
	acc: string,
	options: Options,
	modules: Modules,
): string {
	const mathEnv = mathEnvOptions.mathEnv;
	if (mathEnv === MathEnvs.equation) {
		return modules.mathEnvs?.equation ? modules.mathEnvs.equation(acc, options) : acc;
	} else if (mathEnv === MathEnvs.equationStar) {
		return modules.mathEnvs?.equationStar ? modules.mathEnvs.equationStar(acc, options) : acc;
	} else if (mathEnv === MathEnvs.align) {
		return modules.mathEnvs?.align ? modules.mathEnvs.align(acc, options) : acc;
	} else if (mathEnv === MathEnvs.alignStar) {
		return modules.mathEnvs?.alignStar ? modules.mathEnvs.alignStar(acc, options) : acc;
	} else if (mathEnv === MathEnvs.gather) {
		return modules.mathEnvs?.gather ? modules.mathEnvs.gather(acc, options) : acc;
	} else if (mathEnv === MathEnvs.gatherStar) {
		return modules.mathEnvs?.gatherStar ? modules.mathEnvs.gatherStar(acc, options) : acc;
	} else if (mathEnv === MathEnvs.alignat) {
		return modules.mathEnvs?.alignat
			? modules.mathEnvs.alignat(mathEnvOptions.eqnColumns ?? 2, acc, options)
			: acc;
	} else if (mathEnv === MathEnvs.alignatStar) {
		return modules.mathEnvs?.alignatStar
			? modules.mathEnvs.alignatStar(mathEnvOptions.eqnColumns ?? 2, acc, options)
			: acc;
	}
	console.warn(`mathEnv ${mathEnv} not found`);
	return acc;
}
