import { type Plugin } from 'vite';
import { defaultExts } from './defaultExts';
import { createComponents } from './createComponents';
import { createHandlers } from './createHandlers';
import { matchFile, matchTex, mathlifiedDir } from './matchFiles';
import { createReverseDependencyTree, appendToTree } from './dependencyTree';
import { createPage, createTexPage } from './createPage';
import { createPdf, createTexPdf } from './createPdf';
import {
	texToHtml as defaultTexToHtml,
	texToTex as defaultTexToTex,
} from './transformTex';
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { yellow, red, green } from 'kleur/colors';
import commandExists from 'command-exists';

export function sveltekitTex(options?: MathlifiedOptions): Plugin {
	// handle options
	const {
		tsxCmd,
		generateDefaultComponents,
		cmd,
		cls,
		docOptions,
		preDoc,
		qnsPreDoc,
		preContent,
		postContent,
		exts: customExts,
		texToHtml,
		texToTex,
		generatePdfOnBuild,
		generatePageOnBuild,
	} = {
		tsxCmd: 'tsx',
		generateDefaultComponents: true,
		cmd: 'xelatex',
		cls: 'article',
		docOptions: '',
		preDoc: '\\\\usepackage{amsmath}\n',
		qnsPreDoc: '\\\\usepackage{amsmath}\n\\\\pointsinrightmargin\n\\\\bracketedpoints',
		preContent: '',
		postContent: '',
		exts: {},
		texToHtml: defaultTexToHtml,
		texToTex: defaultTexToTex,
		generatePdfOnBuild: false,
		generatePageOnBuild: false,
		...options,
	};
	const exts = {
		...defaultExts,
		...customExts,
	};
	// track files with ext
	const extList = Object.keys(exts);
	const tsFiles = glob.sync(`./src/lib/mathlified/**/*.{${extList}}.{js,ts}`);
	const tree = createReverseDependencyTree(tsFiles);
	let filesLength = tsFiles.length;
	let filesTracked = Object.keys(tree);
	const promises: Promise<void>[] = [];

	return {
		name: 'vite-plugin-sveltekit-tex',
		async buildStart() {
			if (generateDefaultComponents) {
				createComponents();
				createHandlers();
				console.log(
					yellow(
						`Mathlified: Tracking ${filesLength} files and their dependencies in src/lib/mathlified`,
					),
				);
			}
		},
		async handleHotUpdate({ file, read }) {
			const [isTex, texRoute] = matchTex(file);
			if (isTex) {
				// create page
				createTexPage(texRoute, read, texToHtml);
				// copy tex and create pdf
				createTexPdf(texRoute, read, texToTex, {
					cmd,
					cls,
					docOptions,
					preDoc,
					preContent,
					postContent,
				});
			}
			let newFileMatch: [false] | [true, string, string] = [false];
			// add to dependency tree if not already tracked
			if (!filesTracked.includes(file)) {
				newFileMatch = matchFile(file, extList);
				if (newFileMatch[0]) {
					console.log(
						yellow(
							`Mathlified: New file detected at ${newFileMatch[1]}` +
								'\nUpdating dependencies...',
						),
					);
					filesLength += 1;
					await appendToTree(tree, file, read);
					filesTracked = Object.keys(tree);
					console.log(
						yellow(
							`Mathlified: Now tracking ${filesLength} files and their dependencies`,
						),
					);
				}
			}
			if (filesTracked.includes(file)) {
				if (!newFileMatch[0]) {
					console.log(
						yellow(
							`Mathlified HMR: Change detected for ${file.slice(
								mathlifiedDir().length,
							)}.` + '\nIf dependencies have changed, consider restarting server',
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
							tsxCmd,
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
		async generateBundle() {
			if (generatePdfOnBuild || generatePageOnBuild) {
				let willBuildPdf = false;
				if (generatePdfOnBuild) {
					if (commandExists.sync('xelatex')) {
						willBuildPdf = true;
					} else {
						console.log(
							red(
								'Mathlified PDF generation failed: check if latex in installed on your machine',
							),
						);
					}
				}
				tsFiles.forEach((file) => {
					const filePath = path.resolve(file);
					const [match, fileRoute, ext] = matchFile(filePath, extList);
					if (match) {
						if (generatePageOnBuild) {
							createPage(fileRoute, ext);
						}
						if (willBuildPdf) {
							// tex and pdf
							const collatedPreDoc = ext === 'qn' || ext === 'qns' ? qnsPreDoc : preDoc;
							const collatedCls = ext === 'qn' || ext === 'qns' ? 'exam' : cls;
							const collatedOptions = {
								tsxCmd,
								cmd,
								cls: collatedCls,
								docOptions,
								preDoc: collatedPreDoc,
								preContent,
								postContent,
								...exts[ext].latexOptions,
							};
							promises.push(
								createPdf(
									fileRoute,
									ext,
									async () => {
										const data = await fs.readFile(filePath);
										return data.toString();
									},
									collatedOptions,
								),
							);
						}
					}
				});
			}
		},
		async closeBundle() {
			// ensure all pdf files generated
			await Promise.all(promises);
			if (promises.length !== 0) {
				console.log(yellow('Mathlified: All pdfs generated.\n'));
			}
			// clean up
			console.log(yellow(`Mathlified: Removing Temp files...`));
			fs.remove(path.resolve('./vite-plugin-sveltekit-tex'));
			const tempFiles = glob.sync(`./src/lib/mathlified/**/__*-{${extList}}-src.ts`);
			const removePromises: Promise<void>[] = [];
			tempFiles.forEach((file) => {
				removePromises.push(fs.remove(path.resolve(file)));
			});
			Promise.all(removePromises).then(() => {
				console.log(green('Mathlified: All temp files removed!'));
			});
		},
	};
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
	 * tsx command.
	 * by default, we have tsx installed globally on the machine
	 *
	 * should be changed to "npx tsx" or "pnpm dlx tsx" or "pnpm tsx", etc
	 * if tsx not installed globally
	 * (default "pnpm dlx")
	 */
	tsxCmd?: string;
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
	/**
	 * a function that takes in a string
	 * (which will be read from 'xxx.mathlified.tex')
	 * and returns [html, envs]
	 * where html is a string to be injected into the DOM
	 * and envs is an array of modules to be imported from the 'mathlifier'
	 * package
	 */
	texToHtml?: (texString: string) => [string, Set<string>];
	/**
	 * a function that takes in a string
	 * (which will be read from 'xxx.mathlified.tex')
	 * and returns a tex string to be injected
	 * as content between \begin{document} and \end{document}
	 */
	texToTex?: (texString: string) => string;
	/**
	 * Whether to generate pdfs on build
	 * (default: false)
	 */
	generatePdfOnBuild?: boolean;
	/**
	 * Whether to generate pages on build
	 * (default: false)
	 */
	generatePageOnBuild?: boolean;
}
