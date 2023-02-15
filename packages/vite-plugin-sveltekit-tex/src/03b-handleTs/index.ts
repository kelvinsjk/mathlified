import type { ExtensionOptions, MathlifiedTsOptions } from '../';
import { appendToTree, type Tree } from '../01-dependencyTracking';
import { createPage } from './createPage';
import { createPdf } from './createPdf';
import path from 'path';
import fs from 'fs-extra';
import {
	yellow,
	// red
} from 'kleur/colors';
import { matchFile, normalizePath } from '../utils';
import { ViteDevServer } from 'vite';

export async function handleTs(
	file: string,
	read: () => string | Promise<string>,
	server: ViteDevServer,
	extList: string[],
	depTree: Tree,
	exts: { [key: string]: ExtensionOptions },
	options: Required<MathlifiedTsOptions>,
): Promise<void> {
	const newFile = await updateTree(file, read, extList, depTree);
	if (newFile) {
		const mathlifiedDir = path.resolve('./src/routes');
		console.log(
			yellow(
				`Mathlified HMR: Change detected for ${file.slice(mathlifiedDir.length)}.` +
					'\nIf dependencies have changed, consider restarting server',
			),
		);
	}
	if (depTree[normalizePath(file)]) {
		depTree[file].forEach((f) => {
			const [match, fileRoute, ext] = matchFile(f, extList);
			if (match) {
				// routes/.../+page.svelte
				const localUrl = server.resolvedUrls?.local[0] ?? 'http://localhost:5173';
				createPage(fileRoute, ext, localUrl);
				// tex and pdf
				const collatedOptions = {
					...options,
					...exts[ext].latexOptions,
				};
				createPdf(
					fileRoute,
					ext,
					f === file
						? read
						: async () => {
								const data = await fs.readFile(f);
								return data.toString();
						  },
					collatedOptions,
				);
			}
		});
	}
}

async function updateTree(
	file: string,
	read: () => string | Promise<string>,
	extList: string[],
	depTree: Tree,
): Promise<boolean> {
	let filesTracked = Object.keys(depTree);
	let newFileMatch: [false] | [true, string, string] = [false];
	if (!filesTracked.includes(file)) {
		newFileMatch = matchFile(file, extList);
		if (newFileMatch[0]) {
			console.log(
				yellow(
					`Mathlified: New file detected at ${newFileMatch[1]}` +
						'\nUpdating dependencies...',
				),
			);
			await appendToTree(depTree, file, read);
			filesTracked = Object.keys(depTree);
			console.log(
				yellow(
					`Mathlified: Now tracking ${filesTracked.length} files and their dependencies`,
				),
			);
		}
	}
	return newFileMatch[0];
}
