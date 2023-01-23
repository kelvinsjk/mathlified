import outdent from 'outdent';
import path from 'path';
import fs from 'fs-extra';
import latex from 'node-latex';
import { green } from 'kleur';

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
			console.error(err);
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

export function unSlash(text: string): string {
	return text.replaceAll('\\\\', '\\');
}

export function mathlifiedDir(): string {
	return path.resolve('./src/lib/mathlified');
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
