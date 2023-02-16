import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { preContentTex, postContentTex, writePdf, normalizePath } from '../utils';
import { red } from 'kleur/colors';
import { MathlifiedTsOptions } from '..';
import { build } from 'esbuild';

/**
 * create output/tex/[file].tex file
 */
export async function createPdf(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	options: Required<MathlifiedTsOptions>,
): Promise<void> {
	// build generator files
	const snippetPromise = snippetFactory(file, ext, options);
	const generatorPromise = texFactory(file, ext, read, options);
	// await promise to resolve
	const [generatorPath, snippetPath] = await Promise.all([
		generatorPromise,
		snippetPromise,
	]);
	// generate snippet
	if (options.emitSnippets) {
		generateSnippet(file, snippetPath);
	}
	// generate tex
	await generateTex(file, generatorPath);
	try {
		await writePdf(file, options.latexCmd);
	} catch (err) {
		console.log(err);
	}
}

async function generateSnippet(
	file: string,
	snippetPath: string,
	//options: { tsxCmd: string },
): Promise<void> {
	try {
		await execSnippet(
			file,
			snippetPath,
			//options
		);
	} catch (err) {
		console.log(err);
	}
}

async function execSnippet(
	file: string,
	snippetPath: string,
	//options: { tsxCmd: string },
): Promise<void> {
	const snippetGenPath = normalizePath(
		path.resolve(`./vite-plugin-sveltekit-tex/${file}/snippetGenerator.cjs`),
	);
	await build({
		bundle: true,
		entryPoints: [snippetPath],
		outfile: snippetGenPath,
		platform: 'node',
		alias: {
			mathlifier: 'mathlifier2',
		},
	});
	return new Promise((resolve, reject) => {
		exec(`node ${snippetGenPath}`, (err) => {
			if (err) {
				console.log(red(`Mathlified: snippet generation error`));
				return reject(err);
			}
			console.log(
				`Mathlified: output/snippets/${file.slice(0, -1)}.snippet.tex created/updated`,
			);
			return resolve();
		});
	});
}
async function generateTex(file: string, texPath: string): Promise<void> {
	try {
		await execTex(
			file,
			texPath,
			//options
		);
	} catch (err) {
		console.log(err);
	}
}

async function execTex(file: string, texPath: string): Promise<void> {
	const texGenPath = normalizePath(
		path.resolve(`./vite-plugin-sveltekit-tex/${file}/texGenerator.cjs`),
	);
	await build({
		bundle: true,
		entryPoints: [texPath],
		outfile: texGenPath,
		platform: 'node',
		alias: {
			mathlifier: 'mathlifier2',
		},
	});
	return new Promise((resolve, reject) => {
		exec(`node ${texGenPath}`, (err) => {
			if (err) {
				console.log(red(`Mathlified: snippet generation error`));
				return reject(err);
			} else {
				console.log(`Mathlified: output/tex/${file.slice(0, -1)}.tex created/updated`);
				return resolve();
			}
		});
	});
}

/**
 * texFactory produces texGenerator
 */
async function texFactory(
	file: string,
	ext: string,
	read: () => string | Promise<string>,
	options: Required<MathlifiedTsOptions>,
): Promise<string> {
	const generatorPath = path.resolve(
		`./vite-plugin-sveltekit-tex/${file}/`,
		'./texGenerator.ts',
	);
	const srcLocation = normalizePath(
		path.relative(
			path.resolve(generatorPath, '../'),
			path.resolve(`./src/routes/${file}/_${ext}`),
		),
	);
	const handlerLocation = normalizePath(
		path.relative(
			path.resolve(generatorPath, '../'),
			path.resolve(`./src/lib/mathlified/content-handlers/${ext}`),
		),
	);
	// check for // %preambleArgs=...%
	const data = await read();
	const preambleMatch = data.match(/\/\/ %preambleArg=(.+?)%/);
	let preambleArg: string | undefined;
	if (preambleMatch) {
		preambleArg = preambleMatch[1];
	}
	const preContentMatch = data.match(/\/\/ %preContentArg=(.+?)%/);
	let preContentArg: string | undefined;
	if (preContentMatch) {
		preContentArg = preContentMatch[1];
	}
	const postContentMatch = data.match(/\/\/ %postContentArg=(.+?)%/);
	let postContentArg: string | undefined;
	if (postContentMatch) {
		postContentArg = postContentMatch[1];
	}
	const generatorData = fs
		.readFileSync('./node_modules/vite-plugin-sveltekit-tex/dist/texGenerator.ts')
		.toString()
		.replaceAll('%ext%', ext)
		.replaceAll('%srcLocation%', srcLocation)
		.replaceAll('%handlerLocation%', handlerLocation)
		.replaceAll('%fileLocation%', file.slice(0, -1))
		.replaceAll('%preContent%', preContentTex(options, true, preambleArg, preContentArg))
		.replaceAll('%postContent%', postContentTex(options, true, postContentArg));
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
				path.resolve(`./src/routes/${file}/_${ext}`),
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
			.replaceAll('%fileLocation%', file.slice(0, -1));
		fs.outputFileSync(generatorPath, generatorData);
		return generatorPath;
	}
	return '';
}
