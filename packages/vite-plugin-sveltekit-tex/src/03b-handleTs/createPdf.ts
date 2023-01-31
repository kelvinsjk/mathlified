import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { preContentTex, postContentTex, writePdf, normalizePath } from '../utils';
import { red } from 'kleur/colors';

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
		emitSnippets: boolean;
		cls: string;
		docOptions: string;
		preamble: string;
		preContent: string;
		postContent: string;
	},
): Promise<void> {
	// create duplicate source file with mathlifier2 swapped in
	const duplicatePromise = duplicateSrc(file, ext, read);
	// build generator files
	const generatorPromise = texFactory(file, ext, options);
	const snippetPromise = snippetFactory(file, ext, options);
	// await promise to resolve
	const [generatorPath, snippetPath] = await Promise.all([
		generatorPromise,
		snippetPromise,
		duplicatePromise,
	]);
	// generate snippet
	if (options.emitSnippets) {
		generateSnippet(file, snippetPath, options);
	}
	// generate tex
	await generateTex(file, generatorPath, options);
	try {
		await writePdf(file, options.latexCmd);
	} catch (err) {
		console.log(err);
	}
}

async function generateSnippet(
	file: string,
	snippetPath: string,
	options: { tsxCmd: string },
): Promise<void> {
	try {
		await execSnippet(file, snippetPath, options);
	} catch (err) {
		console.log(err);
	}
}

async function execSnippet(
	file: string,
	snippetPath: string,
	options: { tsxCmd: string },
): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(`${options.tsxCmd} ${snippetPath}`, (err) => {
			if (err) {
				console.log(red(`Mathlified: snippet generation error`));
				return reject(err);
			}
			console.log(`Mathlified: output/snippets${file}.snippet.tex created/updated`);
			return resolve();
		});
	});
}
async function generateTex(
	file: string,
	texPath: string,
	options: { tsxCmd: string },
): Promise<void> {
	try {
		await execTex(file, texPath, options);
	} catch (err) {
		console.log(err);
	}
}

async function execTex(
	file: string,
	texPath: string,
	options: { tsxCmd: string },
): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(`${options.tsxCmd} ${texPath}`, (err) => {
			if (err) {
				console.log(red(`Mathlified: tex generation error`));
				return reject(err);
			}
			console.log(`Mathlified: output/tex${file}.tex created/updated`);
			return resolve();
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
		preamble: string;
		preContent: string;
		postContent: string;
	},
): Promise<string> {
	const generatorPath = path.resolve(
		`./vite-plugin-sveltekit-tex/${file}/`,
		'./texGenerator.ts',
	);
	const srcLocation = normalizePath(
		path.relative(
			path.resolve(generatorPath, '../'),
			path.resolve(
				`./src/lib/mathlified/${file}`,
				`../__${path.parse(file).name}.${ext}-src`,
			),
		),
	);
	const handlerLocation = normalizePath(
		path.relative(
			path.resolve(generatorPath, '../'),
			path.resolve(`./src/lib/mathlified/content-handlers/${ext}`),
		),
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
 * snippetFactory produces snippetGenerator
 */
async function snippetFactory(
	file: string,
	ext: string,
	options: {
		emitSnippets: boolean;
	},
): Promise<string> {
	if (options.emitSnippets) {
		const generatorPath = path.resolve(
			`./vite-plugin-sveltekit-tex/${file}/`,
			'./snippetGenerator.ts',
		);
		const srcLocation = normalizePath(
			path.relative(
				path.resolve(generatorPath, '../'),
				path.resolve(
					`./src/lib/mathlified/${file}`,
					`../__${path.parse(file).name}.${ext}-src`,
				),
			),
		);
		const handlerLocation = normalizePath(
			path.relative(
				path.resolve(generatorPath, '../'),
				path.resolve(`./src/lib/mathlified/content-handlers/${ext}`),
			),
		);
		const generatorData = fs
			.readFileSync('./node_modules/vite-plugin-sveltekit-tex/dist/snippetGenerator.ts')
			.toString()
			.replaceAll('%ext%', ext)
			.replaceAll('%srcLocation%', srcLocation)
			.replaceAll('%handlerLocation%', handlerLocation)
			.replaceAll('%fileLocation%', file);
		fs.outputFileSync(generatorPath, generatorData);
		return generatorPath;
	}
	return '';
}
