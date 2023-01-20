import path from 'path';
import fs from 'fs-extra';
import outdent from 'outdent';
import { exec } from 'child_process';
import latex from 'node-latex';
import { green } from 'kleur';

/**
 * create output/tex/[file].tex file
 */
export async function createPdf(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	options: {
		cmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
): Promise<void> {
	// create duplicate source file with mathlifier2 swapped in
	const duplicatePromise = duplicateSrc(file, ext, read);
	// build generator file
	const generatorPromise = texFactory(file, ext, options);
	// await promise to resolve
	const [generatorPath] = await Promise.all([generatorPromise, duplicatePromise]);
	// generate TeX and pdf
	exec(`tsx ${generatorPath}`, (err) => {
		if (err) {
			console.log(`Mathlified: tex generation error: ${err}`);
			return;
		}
		console.log(`Mathlified: output/tex${file}.tex created/updated`);
		writePdf(file, options.cmd);
	});
}

/**
 * duplicate file.ext.[t|j]s
 * to src.ts
 * with "mathlifier" replaced with "mathlifier2"
 */
async function duplicateSrc(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
): Promise<string> {
	const duplicatePath = path.resolve(
		`./src/lib/mathlified/${file}`,
		`../__${path.parse(file).name}-${ext}-src.ts`,
	);
	const srcData = (await read())
		.replaceAll("'mathlifier'", "'mathlifier2'")
		.replaceAll('"mathlifier"', "'mathlifier2'");
	fs.outputFileSync(duplicatePath, srcData);
	return duplicatePath;
}

/**
 * texFactory produces texGenerator
 */
async function texFactory(
	file: string,
	ext: string,
	options: {
		cmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
): Promise<string> {
	const generatorPath = path.resolve(
		`./vite-plugin-sveltekit-tex/${file}/`,
		'./texGenerator.ts',
	);
	const srcLocation = path.relative(
		path.resolve(generatorPath, '../'),
		path.resolve(
			`./src/lib/mathlified/${file}`,
			`../__${path.parse(file).name}-${ext}-src.ts`,
		),
	);
	const handlerLocation = path.relative(
		path.resolve(generatorPath, '../'),
		path.resolve(`./src/lib/mathlified/content-handlers/${ext}`),
	);
	const generatorData = fs
		.readFileSync('./node_modules/vite-plugin-sveltekit-tex/dist/texGenerator.ts')
		.toString()
		.replaceAll('%ext%', ext)
		.replaceAll('%srcLocation%', srcLocation)
		.replaceAll('%handlerLocation%', handlerLocation)
		.replaceAll('%fileLocation%', file)
		.replaceAll('%preContent%', preContentTex(options))
		.replaceAll('%postContent%', postContentTex(options));
	fs.outputFileSync(generatorPath, generatorData);
	return generatorPath;
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
	pdf.on('finish', () =>
		console.log(green(`Mathlified: output/pdf${file}.pdf generated!`)),
	);
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
