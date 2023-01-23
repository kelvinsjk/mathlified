import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { preContentTex, postContentTex, writePdf } from '../utils';

/**
 * create output/tex/[file].tex file
 */
export async function createPdf(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	options: {
		tsxCmd: string;
		latexCmd: string;
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
			return resolve(writePdf(file, options.latexCmd));
		});
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
		latexCmd: string;
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
