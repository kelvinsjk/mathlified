let webExtensions: string[] = [];
let pdfExtensions: string[] = [];
let pdfOptions: Options = {};
const matches: Record<
	string,
	{ urls: string[]; files: string[]; titles: string[] }
> = {};
import { exec } from 'node:child_process';
import { createLogger } from 'vite';
import colors from 'picocolors';
export type Folder = {
	name: string;
	title: string;
	slug: string;
	url: string;
	directoryPath: string;
	contents: (Page | Folder)[];
};
type Page = {
	name: string;
	title: string;
	slug: string;
	url: string;
	filePath: string;
	ext: string;
};
import slugify from 'slugify';
import { readdirSync } from 'node:fs';
import { outputFile, outputFileSync, remove } from 'fs-extra/esm';
import { format } from 'prettier';
import { cwd } from 'node:process';
import fm from 'front-matter';

const logger = createLogger('info', { prefix: '[mathlified]' });
const info = (x: string) => logger.info(x, { timestamp: true });
const error = (x: string) => logger.error(x, { timestamp: true });
const success = (x: string, file: string) =>
	logger.info(colors.green(x) + ' ' + file, { timestamp: true });

interface Options {
	pdf?: {
		engine?:
			| 'pdflatex'
			| 'xelatex'
			| 'lualatex'
			| 'tectonic'
			| 'latexmk';
		documentClass?: string;
		fontSize?: string;
		paperSize?: string;
		classOption?: string;
		includeIn?: {
			header?: string;
			beforeBody?: string;
			afterBody?: string;
		};
	};
}

export function mathlified(options?: Options): import('vite').Plugin {
	return {
		name: 'mathlified',
		async configResolved(config) {
			if (config.command === 'serve') {
				await getTemplates();
				generateTOC();

				if (options) pdfOptions = options;
			}
		},

		async hotUpdate({ type, file, read, server }) {
			const pathToSrc = `${cwd()}/src`;
			const pathToContent = `${pathToSrc}/content`;
			const pathToTemplates = `${pathToSrc}/templates`;
			if (type === 'create' || type === 'delete') {
				if (
					file.startsWith(pathToTemplates) ||
					file.startsWith(pathToContent)
				) {
					await getTemplates();
					generateTOC();
				}
			}
			// update content
			if (file.startsWith(`${pathToContent}`)) {
				if (file.endsWith('.md')) {
					// update page
					server.ws.send({ type: 'custom', event: 'md-update' });
					// generate pdf
					const { attributes, body } = fm(await read());
					if (
						attributes !== null &&
						typeof attributes === 'object' &&
						'pdf' in attributes &&
						attributes.pdf
					) {
						const fileName = file.slice(
							pathToContent.length,
							file.length - 3
						);
						const newBody =
							'title' in attributes
								? `# ${attributes.title}\n\n${body}`
								: body;
						generatePdfFromDjot(newBody, fileName);
					}
				}
			}
		}
	};
}

async function getTemplates() {
	const newWebExtensions: string[] = ['.md'];
	const docs = readdirSync('./src/templates/', {
		withFileTypes: true
	});
	for (const doc of docs) {
		if (!doc.isDirectory()) {
			if (doc.name.endsWith('.svelte')) {
				const fileName = doc.name.slice(0, doc.name.length - 7);
				const lowerCased =
					fileName[0].toLowerCase() + fileName.slice(1);
				newWebExtensions.push(
					`.${lowerCased}.js`,
					`.${lowerCased}.ts`
				);
				matches[lowerCased] = { urls: [], files: [], titles: [] };
			}
		}
	}
	webExtensions = newWebExtensions;
	matches.md = { urls: [], files: [], titles: [] };
	return;
}

async function generateTOC() {
	const tree: Folder = {
		name: 'base-contents-folder',
		title: 'Mathlified',
		slug: '',
		directoryPath: '',
		url: '',
		contents: []
	};
	addFolderToDirectory(tree.directoryPath, tree, tree.url);
	const prettyString = await format(JSON.stringify(tree), {
		parser: 'json'
	});
	// toc
	const promises = [
		outputFile('./src/mathlified/toc.json', prettyString)
	];

	for (const [ext, arr] of Object.entries(matches)) {
		// extensions
		const prettyString = await format(JSON.stringify(arr), {
			parser: 'json'
		});
		promises.push(
			outputFile(`./src/mathlified/${ext}.json`, prettyString)
		);
	}
	await Promise.all(promises);
	return;
}

function addFolderToDirectory(
	path: string,
	parentFolder: Folder,
	parentUrl: string
) {
	const docs = readdirSync(`./src/content${path}`, {
		withFileTypes: true
	});
	for (const doc of docs) {
		if (doc.isDirectory()) {
			const contents: (Folder | Page)[] = [];
			const directoryPath = `${path || '/'}${doc.name}`;
			const name = replaceLeadingDigitsDash(doc.name);
			const url = `${parentUrl || '/'}${name}`;
			const folder: Folder = {
				name,
				title: makeTitle(name),
				slug: slugify(name),
				url,
				directoryPath,
				contents
			};
			parentFolder.contents.push(folder);
			addFolderToDirectory(directoryPath, folder, url);
		} else {
			addFileToFolder(doc.name, parentFolder, parentUrl);
		}
	}
}
function addFileToFolder(
	path: string,
	folder: Folder,
	parentUrl: string
) {
	const extRemoval = removeExtension(replaceLeadingDigitsDash(path));
	if (extRemoval === undefined) return;
	const [fileName, ext] = extRemoval;
	const slug = fileName === 'index' ? '' : slugify(fileName);
	const url = `${parentUrl}/${slug}`;
	const filePath = `${folder.directoryPath}/${path}`;
	const title =
		fileName === 'index' ? 'Mathlified' : makeTitle(fileName);
	folder.contents.push({
		name: fileName,
		title,
		slug,
		filePath,
		url,
		ext
	});
	addToParamMatcher(path, url, filePath, title);
}

async function generatePdfFromDjot(body: string, fileName: string) {
	// TODO: options
	info('Generating pdf...');
	outputFileSync('./.mathlified/temp.dj', transformMath(body));
	outputFileSync(`./output/${fileName}.pdf`, '');
	exec(
		`djot -t pandoc ./.mathlified/temp.dj | pandoc -f json -s -t pdf -o ./output/${fileName}.pdf`,
		//`djot -t pandoc ./.mathlified/temp.dj | pandoc -f json -s -t latex -o ./output/${fileName}.tex`,
		(err, _, stderr) => {
			if (err) {
				error(`Error generating pdf!\n${err.message}`);
			} else if (stderr) {
				error(`Error generating pdf! stderr: ${stderr}`);
			} else {
				success(`PDF generated`, `output/${fileName}.pdf`);
				remove('./.mathlified');
			}
		}
	);
}

function replaceLeadingDigitsDash(str: string) {
	return str.replace(/(^|\/)[\d-]+[a-z]?-/g, '$1');
}

/**
 * @param str file name
 * @returns [fileWithoutExtension, extension] or undefined
 */
function removeExtension(str: string): [string, string] | undefined {
	for (const ext of webExtensions) {
		if (str.endsWith(ext)) {
			return [str.slice(0, str.length - ext.length), ext.slice(1)];
		}
	}
	return undefined;
}

function addToParamMatcher(
	fileName: string,
	path: string,
	filePath: string,
	title: string
) {
	for (const ext of webExtensions) {
		if (fileName.endsWith(ext)) {
			// .md vs .ext.js
			const end = ext === '.md' ? ext.length : ext.length - 3;
			matches[ext.slice(1, end)].urls.push(path);
			matches[ext.slice(1, end)].files.push(filePath);
			matches[ext.slice(1, end)].titles.push(title);
		}
	}
}

// some code modified from
// https://github.com/sveltejs/svelte.dev/blob/main/packages/site-kit/src/lib/server/content/index.ts

function makeTitle(string: string) {
	return (
		string.charAt(0).toUpperCase() + string.slice(1)
	).replaceAll('-', ' ');
}

function transformMath(x: string): string {
	return x
		.replace(
			/(?<![\\`])\$\$(?!`)([^]+?)\$\$(?!`)/g,
			(_, match) => `$$\`${match.replaceAll('\\_', '_')}\``
		)
		.replace(
			/(?<![\\`$])\$(?![`$])([^]+?)(?<!\\)\$(?![`$])/g,
			(_, match) => `$\`${match.replaceAll('\\_', '_')}\``
		);
}
