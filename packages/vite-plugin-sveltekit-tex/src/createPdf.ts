import path from 'path';
import fs from 'fs-extra';
import outdent from 'outdent';
import { exec } from 'child_process';
import latex from 'node-latex';

/**
 * duplicate file.ext.[t|j]s
 * to src.ts
 * with "mathlifier" replaced with "mathlifier2"
 */
export async function duplicateSrc(
	file: string,
	read: () => string | Promise<string>,
	hmr: boolean,
): Promise<void> {
	const duplicatePath = hmr
		? path.resolve(`./vite-plugin-sveltekit-tex/hmr/src.ts`)
		: path.resolve(`./vite-plugin-sveltekit-tex/hmr/${file}`, '../src.ts');
	const srcData = (await read())
		.replaceAll("'mathlifier'", "'mathlifier2'")
		.replaceAll('"mathlifier"', "'mathlifier2'");
	fs.outputFileSync(duplicatePath, srcData);
}

/**
 * create output/tex/[file].tex file
 */
export async function createPdf(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	// eslint-disable-next-line
	contentHandler: (extObject: any) => string,
	options: {
		cmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
	hmr: boolean,
): Promise<void> {
	// create duplicate source file with mathlifier2 swapped
	const duplicatePath = hmr
		? path.resolve(`./vite-plugin-sveltekit-tex/hmr/src.ts`)
		: path.resolve(`./vite-plugin-sveltekit-tex/${file}`, '../src.ts');
	const srcData = (await read())
		.replaceAll("'mathlifier'", "'mathlifier2'")
		.replaceAll('"mathlifier"', "'mathlifier2'");
	fs.outputFileSync(duplicatePath, srcData);
	// build generator file
	const generatorPath = hmr
		? path.resolve(`./vite-plugin-sveltekit-tex/hmr/texGenerator.ts`)
		: path.resolve(`./vite-plugin-sveltekit-tex/${file}`, '../texGenerator.ts');
	const generatorData = fs
		.readFileSync('./node_modules/vite-plugin-sveltekit-tex/dist/texGenerator.ts')
		.toString()
		.replaceAll('%ext%', ext)
		.replaceAll('%fileLocation%', file)
		.replaceAll('%preContent%', preContentTex(options))
		.replaceAll('%postContent%', postContentTex(options));
	fs.outputFileSync(generatorPath, generatorData);
	// generate TeX and pdf
	exec(`tsx ${generatorPath}`, (err) => {
		if (err) {
			console.log(`Mathlified pdf generation error: ${err}`);
			return;
		}
		console.log(`Mathlified: output/tex${file}.tex created/updated`);
		writePdf(file, options.cmd);
	});
}

/**
 * create output/pdf/[file].pdf file
 */
function writePdf(file: string, cmd: string): void {
	const input = fs.createReadStream(`./output/tex/${file}.tex`);
	fs.outputFileSync(`./output/pdf/${file}.pdf`, '');
	const output = fs.createWriteStream(`./output/pdf/${file}.pdf`);
	const pdf = latex(input, { cmd });
	pdf.pipe(output);
	pdf.on('error', (err) => console.error(err));
	pdf.on('finish', () => console.log(`Mathlified: output/pdf${file}.pdf generated!`));
}

function preContentTex(options: {
	cls: string;
	docOptions: string;
	preDoc: string;
	preContent: string;
}): string {
	// handling of options
	const documentOptions = options.docOptions ? `[${options.docOptions}]` : '';

	// tex data generation
	return outdent`
		\\\\documentclass${documentOptions}{${options.cls}}
		${options.preDoc}
		\\\\begin{document}
		${options.preContent}
	`;
}
function postContentTex(options: { postContent: string }): string {
	return outdent`
		${options.postContent}
		\\\\end{document}
	`;
}
