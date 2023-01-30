import outdent from 'outdent';
import path from 'path';
import fs from 'fs-extra';
import latex from 'node-latex';
import { green, red } from 'kleur';
import os from 'os';

/**
 * create output/pdf/[file].pdf file
 */
export async function writePdf(file: string, cmd: string): Promise<void> {
	const input = fs.createReadStream(`./output/tex/${file}.tex`);
	fs.outputFileSync(`./output/pdf/${file}.pdf`, '');
	const output = fs.createWriteStream(`./output/pdf/${file}.pdf`);
	const pdf = latex(input, { cmd });
	pdf.pipe(output);
	return new Promise((resolve, reject) => {
		pdf.on('error', (err) => {
			console.error(red(`Mathlified: pdf generation error`));
			return reject(err);
		});
		pdf.on('finish', () => {
			console.log(green(`Mathlified: output/pdf${file}.pdf generated!`));
			return resolve();
		});
	});
}

export function preContentTex(
	options: {
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
	},
	escapedSlash = true,
): string {
	// handling of options
	let documentOptions = options.docOptions ? `[${options.docOptions}]` : '';
	let cls = options.cls;
	let preDoc = options.preDoc;
	let preContent = options.preContent;
	let slash = '\\\\';
	if (!escapedSlash) {
		slash = '\\';
		documentOptions = unSlash(documentOptions);
		cls = unSlash(cls);
		preDoc = unSlash(preDoc);
		preContent = unSlash(preContent);
	}

	// tex data generation
	return outdent`
		${slash}documentclass${documentOptions}{${cls}}
		${preDoc}
		${slash}begin{document}
		${preContent}
	`;
}

export function postContentTex(
	options: { postContent: string },
	escapedSlash = true,
): string {
	const slash = escapedSlash ? '\\\\' : '\\';
	const postContent = escapedSlash ? options.postContent : unSlash(options.postContent);
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

export function unSlash(text: string): string {
	return text.replaceAll('\\\\', '\\');
}

export function mathlifiedDir(): string {
	return normalizePath(path.resolve('./src/lib/mathlified'));
}
export function matchFile(
	file: string,
	extList: string[],
): [true, string, string] | [false] {
	for (const extName of extList) {
		const extMatch = file.match(
			new RegExp(`${mathlifiedDir()}(.+)\\.${extName}\\.[t|j]s`),
		);
		if (extMatch) {
			return [true, extMatch[1], extName];
		}
	}
	return [false];
}
