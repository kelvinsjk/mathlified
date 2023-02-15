import outdent from 'outdent';
import path from 'path';
import fs from 'fs-extra';
import latex from 'node-latex';
import { green, red } from 'kleur';
import os from 'os';
import type { LatexOptions } from './';

/**
 * create output/pdf/[file].pdf file
 */
export async function writePdf(file: string, cmd: string): Promise<void> {
	const input = fs.createReadStream(`./output/tex/${file.slice(0, -1)}.tex`);
	fs.outputFileSync(`./output/pdf/${file.slice(0, -1)}.pdf`, '');
	const output = fs.createWriteStream(`./output/pdf/${file.slice(0, -1)}.pdf`);
	const pdf = latex(input, { cmd });
	pdf.pipe(output);
	return new Promise((resolve, reject) => {
		pdf.on('error', (err) => {
			console.error(red(`Mathlified: pdf generation error`));
			return reject(err);
		});
		pdf.on('finish', () => {
			console.log(green(`Mathlified: output/pdf/${file.slice(0, -1)}.pdf generated!`));
			return resolve();
		});
	});
}

export function preContentTex(
	options: Required<LatexOptions>,
	escapedSlash = true,
	preambleArg = '',
	preContentArg = '',
): string {
	// handling of options
	let documentOptions = options.docOptions ? `[${options.docOptions}]` : '';
	let cls = options.cls;
	let preamble = options.preamble;
	if (typeof preamble !== 'string') {
		preamble = preamble(preambleArg);
	}
	let preContent = options.preContent;
	if (typeof preContent !== 'string') {
		preContent = preContent(preContentArg);
	}
	let slash = '\\';
	if (escapedSlash) {
		slash = '\\\\';
		documentOptions = reSlash(documentOptions);
		cls = reSlash(cls);
		preamble = reSlash(preamble);
		preContent = reSlash(preContent);
	}

	// tex data generation
	return outdent`
		${slash}documentclass${documentOptions}{${cls}}
		${preamble}
		${slash}begin{document}
		${preContent}
	`;
}

export function postContentTex(
	options: Required<LatexOptions>,
	escapedSlash = true,
	postContentArg = '',
): string {
	const slash = escapedSlash ? '\\\\' : '\\';
	let postContent = options.postContent;
	if (typeof postContent !== 'string') {
		postContent = postContent(postContentArg);
	}
	if (escapedSlash) {
		postContent = reSlash(postContent);
	}
	return outdent`
		${postContent}
		${slash}end{document}
	`;
}

// normalize path and slash function taken from vite
// https://github.com/vitejs/vite/blob/efc8979a2dc407278d27cf439be3462e8feeb977/packages/vite/src/node/utils.ts
// since tsup isn't bundling it correctly
export function normalizePath(file: string): string {
	const isWindows = os.platform() === 'win32';
	return path.posix.normalize(isWindows ? slash(file) : file);
}
function slash(p: string): string {
	return p.replace(/\\/g, '/');
}

export function reSlash(text: string): string {
	return text.replaceAll('\\', '\\\\');
}

export function routesDir(): string {
	return normalizePath(path.resolve('./src/routes'));
}
export function matchFile(
	file: string,
	extList: string[],
): [true, string, string] | [false] {
	for (const extName of extList) {
		const extMatch = file.match(new RegExp(`${routesDir()}/(.+)_${extName}\\.[t|j]s`));
		if (extMatch) {
			return [true, extMatch[1], extName];
		}
	}
	return [false];
}
