import { type Plugin } from 'vite';
import path from 'path';
import { createPage } from './createPage';
import { createPdf } from './createPdf';
import { createComponents } from './createComponents';
import { createHandlers } from './createHandlers';
import { defaultExts } from './defaultExts';
import dependencyTree from 'dependency-tree';
import glob from 'glob';
import fs from 'fs-extra';
import { blue, yellow } from 'kleur/colors';

export function sveltekitTex(options?: MathlifiedOptions): Plugin {
	// handle options
	const {
		generateDefaultComponents,
		cmd,
		cls,
		docOptions,
		preDoc,
		qnsPreDoc,
		preContent,
		postContent,
		exts: customExts,
	} = {
		generateDefaultComponents: true,
		cmd: 'xelatex',
		cls: 'article',
		docOptions: '',
		preDoc: '\\\\usepackage{amsmath}\n',
		qnsPreDoc: '\\\\usepackage{amsmath}\n\\\\pointsinrightmargin\n\\\\bracketedpoints',
		preContent: '',
		postContent: '',
		exts: {},
		...options,
	};
	const exts = {
		...defaultExts,
		...customExts,
	};
	const extList = Object.keys(exts);
	const files = glob.sync(`./src/lib/mathlified/**/*.{${extList}}.{js,ts}`);
	const tree = createReverseDependencyTree(files);
	let filesTracked = Object.keys(tree);

	return {
		name: 'vite-plugin-sveltekit-tex',
		async buildStart() {
			if (generateDefaultComponents) {
				createComponents();
				createHandlers();
				console.log(
					yellow(
						`Mathlified: Tracking ${files.length} files and their dependencies in src/lib/mathlified`,
					),
				);
			}
		},
		async handleHotUpdate({ file, read }) {
			// check if not dependency tree
			let newFileMatch: [false] | [true, string, string] = [false];
			if (!filesTracked.includes(file)) {
				newFileMatch = matchFile(file, extList);
				if (newFileMatch[0]) {
					console.log(blue(`Mathlified: New file detected at ${newFileMatch[1]}`));
					appendToTree(tree, file);
					filesTracked = Object.keys(tree);
					console.log(
						blue(`Mathlified: Now tracking ${files.length} files and their dependencies`),
					);
				}
			}
			if (filesTracked.includes(file)) {
				if (!newFileMatch[0]) {
					console.log(
						blue(
							`Mathlified HMR: Change detected for ${file.slice(mathlifiedDir().length)}`,
						),
					);
				}
				tree[file].forEach((f) => {
					const [match, fileRoute, ext] = matchFile(f, extList);
					if (match) {
						// routes/.../+page.svelte
						createPage(fileRoute, ext);
						// tex and pdf
						const collatedPreDoc = ext === 'qn' || ext === 'qns' ? qnsPreDoc : preDoc;
						const collatedCls = ext === 'qn' || ext === 'qns' ? 'exam' : cls;
						const collatedOptions = {
							cmd,
							cls: collatedCls,
							docOptions,
							preDoc: collatedPreDoc,
							preContent,
							postContent,
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
		},
	};
}

function mathlifiedDir(): string {
	return path.resolve('./src/lib/mathlified');
}
function matchFile(file: string, extList: string[]): [true, string, string] | [false] {
	for (const extName of extList) {
		const extMatch = file.match(new RegExp(`${mathlifiedDir()}(.+).${extName}.[t|j]s`));
		if (extMatch) {
			return [true, extMatch[1], extName];
		}
	}
	return [false];
}

/**
 * create a reverse dependency tree
 * to facilitate HMR
 */
function createReverseDependencyTree(files: string[]): Tree {
	const tree: Tree = {};
	files.forEach((file) => {
		file = path.resolve(file);
		const dependencyList = dependencyTree.toList({
			filename: file,
			directory: path.resolve('./src/lib/mathlified'),
		});
		dependencyList.forEach((dep) => {
			if (tree[dep] === undefined) {
				tree[dep] = [file];
			} else {
				if (!tree[dep].includes(file)) {
					tree[dep].push(file);
				}
			}
		});
	});
	return tree;
}

function appendToTree(tree: Tree, file: string): Tree {
	const dependencyList = dependencyTree.toList({
		filename: file,
		directory: path.resolve('./src/lib/mathlified'),
	});
	dependencyList.forEach((dep) => {
		if (tree[dep] === undefined) {
			tree[dep] = [file];
		} else {
			if (!tree[dep].includes(file)) {
				tree[dep].push(file);
			}
		}
	});
	return tree;
}

interface Tree {
	[key: string]: string[];
}

export interface ExtensionOptions {
	latexOptions?: LatexOptions;
}

export interface LatexOptions {
	cmd?: string;
	cls?: string;
	docOptions?: string;
	preDoc?: string;
	preContent?: string;
	postContent?: string;
}

export interface MathlifiedOptions {
	/**
	 * Generates Post/Qn/Qns.svelte on buildStart if they are absent
	 * (default: true)
	 * */
	generateDefaultComponents?: boolean;
	/**
	 * Default command to use when running node-latex
	 * (can be overridden by custom extension options)
	 * (default: 'xelatex')
	 */
	cmd?: string;
	/**
	 * Default latex document class for "post" and custom extensions
	 * (can be overridden by custom extension options)
	 * (default: 'article')
	 *
	 * Note that the "qn" and "qns" extension use the "exam" class by default
	 * and cannot be changed unless the extension is customized
	 */
	cls?: string;
	/**
	 * Default latex document options
	 * (can be overridden by custom extension options)
	 * (default: '')
	 */
	docOptions?: string;
	/**
	 * Default content to be placed before the `\begin{document}` command
	 * for "post" and custom extensions
	 * (can be overridden by custom extension options)
	 * (default: `\usepackage{amsmath}\n`)
	 *
	 * Note that the "qn" and "qns" extension use qnsPreDoc option instead
	 */
	preDoc?: string;
	/**
	 * Default content to be placed before the `\begin{document}` command
	 * for "qn" and "qns" extensions
	 * (can be overridden by customizing those extensions)
	 * (default: `\usepackage{amsmath}\n\bracketedpoints\pointsinrightmargin`)
	 */
	qnsPreDoc?: string;
	/**
	 * Default content to be placed after the `\begin{document}` command
	 * and before the content body
	 * (default: ``)
	 */
	preContent?: string;
	/**
	 * Default content to be placed after the content body
	 * and before the `\end{document}` command
	 * (default: ``)
	 */
	postContent?: string;
	/**
	 * An object of the form `{
	 * 	extName: {
	 * 		latexOptions?: LatexOptions;
	 * 		contentHandler(extObject: object): string
	 * 	}
	 * }`
	 * to add custom extensions for the plugin to handle
	 * contentHandler is called to produce the latex content while
	 * SvelteKit side handling should be done by adding a
	 * component in 'src/lib/mathlified/[Extname].svelte'
	 */
	exts?: { [key: string]: ExtensionOptions };
}
