import path from 'path';
import fs from 'fs-extra';
import outdent from 'outdent';
import { exec } from 'child_process';
import latex from 'node-latex';
import { green } from 'kleur';
import { unSlash } from './transformTex';

/**
 * create output/tex/[file].tex file
 */
export async function createPdf(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	options: {
		tsxCmd: string;
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
	return new Promise((resolve, reject) => {
		exec(`${options.tsxCmd} ${generatorPath}`, (err) => {
			if (err) {
				console.log(`Mathlified: tex generation error: ${err}`);
				return reject(err);
			}
			console.log(`Mathlified: output/tex${file}.tex created/updated`);
			return resolve(writePdf(file, options.cmd));
		});
	});
}

export async function createTexPdf(
	texRoute: string,
	read: () => string | Promise<string>,
	texToTex: (x: string) => string,
	options: {
		cmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
): Promise<void> {
	const outputTexPath = path.resolve(`./output/tex${texRoute}.tex`);
	const content = await read();
	const data =
		preContentTex(options, false) +
		'\n' +
		texToTex(content) +
		'\n' +
		postContentTex(options, false);
	fs.outputFileSync(outputTexPath, data);
	writePdf(texRoute, options.cmd);
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
		`../__${path.parse(file).name}.${ext}-src.ts`,
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
			`../__${path.parse(file).name}.${ext}-src`,
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
async function writePdf(file: string, cmd: string): Promise<void> {
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

function preContentTex(
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
function postContentTex(options: { postContent: string }, escapedSlash = true): string {
	const slash = escapedSlash ? '\\\\' : '\\';
	const postContent = escapedSlash ? options.postContent : unSlash(options.postContent);
	return outdent`
		${postContent}
		${slash}end{document}
	`;
}
