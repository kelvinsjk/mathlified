import { type Plugin } from 'vite';
import { matchFile } from './utils';
import { createPage } from './03b-handleTs/createPage';
import { createPdf } from './03b-handleTs/createPdf';
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { yellow, red, green } from 'kleur/colors';
import commandExists from 'command-exists';

import { trackFiles } from './01-dependencyTracking';
import { createDefaults } from './02-buildStart';
import { handleTex } from './03a-handleTex';
import { handleTs } from './03b-handleTs';
import { defaultExts, defaultTexExts } from './defaultExts';

export function mathlified(options?: MathlifiedOptions): Plugin {
	// handle options
	const {
		generateDefaults,
		exts: customExts,
		texExts,
		latexCmd,
		emitSnippets,
		cls,
		docOptions,
		preamble,
		preContent,
		postContent,
		generatePdfOnBuild,
		generatePageOnBuild,
	} = {
		generateDefaults: true,
		exts: {},
		texExts: defaultTexExts,
		latexCmd: 'xelatex',
		emitSnippets: true,
		cls: 'article',
		docOptions: '',
		preamble: '\\usepackage{amsmath}\n',
		preContent: '',
		postContent: '',
		generatePdfOnBuild: false,
		generatePageOnBuild: false,
		...options,
	};
	const exts = {
		...defaultExts,
		...customExts,
	};
	// track files with ext
	const { extList, srcFiles, depTree, srcNo } = trackFiles(exts);
	// promises to be used in generateBundle
	const promises: Promise<void>[] = [];

	return {
		name: 'vite-plugin-sveltekit-tex',
		async buildStart() {
			if (generateDefaults) {
				createDefaults();
			}
			console.log(
				yellow(
					`Mathlified: Tracking ${srcNo} source files and their dependencies (total of ${
						Object.keys(depTree).length
					}) in src/`,
				),
			);
		},
		async handleHotUpdate({ file, read, server }) {
			handleTex(file, read, texExts, {
				latexCmd,
				cls,
				docOptions,
				preamble,
				preContent,
				postContent,
			});
			handleTs(file, read, server, extList, depTree, exts, {
				emitSnippets,
				latexCmd,
				cls,
				docOptions,
				preamble,
				preContent,
				postContent,
			});
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
				srcFiles.forEach((file) => {
					const filePath = path.resolve(file);
					const [match, fileRoute, ext] = matchFile(filePath, extList);
					if (match) {
						if (generatePageOnBuild) {
							createPage(fileRoute, ext);
						}
						if (willBuildPdf) {
							// tex and pdf
							const collatedOptions = {
								emitSnippets,
								latexCmd,
								cls,
								docOptions,
								preamble,
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
			const removePromises: Promise<void>[] = [];
			// ./vite-plugin-sveltekit-tex folder (snippet and tex generators)
			removePromises.push(fs.remove(path.resolve('./vite-plugin-sveltekit-tex')));
			// alternate source files (with mathlifier2)
			const tempFiles = glob.sync(`./src/routes/**/__{${extList}}-duplicate.ts`);
			tempFiles.forEach((file, i) => {
				if (i === 0) {
					console.log(yellow(`Mathlified: Removing Temp files...`));
				}
				removePromises.push(fs.remove(path.resolve(file)));
			});
			await Promise.all(removePromises);
			console.log(green('Mathlified: All temp files removed!'));
		},
	};
}

export interface ExtensionOptions {
	latexOptions?: LatexOptions;
}
export interface TexExtensionOptions {
	latexOptions?: LatexOptions;
	/**
	 * function to convert data in tex file to html markup
	 * @returns [markup, mathlifierFns]
	 * where mathlifierFns is a Set<string> containing the names
	 * of functions to be imported from mathlifier to facilitate conversion
	 * to html.
	 */
	texToHtml: (x: string) => [string, Set<string>?];
	/**
	 * function to convert data in tex file to actual LaTeX markup
	 * @returns markup
	 */
	texToTex: (x: string) => string;
	/**
	 * string to be inserted into the <scripts> portion of the svelte file
	 */
	svelteScripts?: string;
	/**
	 * string to be inserted before the main content
	 */
	sveltePreContent?: string;
	/**
	 * string to be inserted after the main content
	 * useful for custom styles
	 */
	sveltePostContent?: string;
}

export interface LatexOptions {
	/**
	 * Default command to use when running node-latex
	 * (can be overridden by custom extension options)
	 * (default: 'xelatex')
	 */
	latexCmd?: string;
	/**
	 * Default latex document class
	 * (can be overridden by custom extension options)
	 * (default: 'article')
	 *
	 * Note that the "qn" and "qns" extension use the "exam" class by default
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
	 * (can be overridden by custom extension options)
	 * (default: `\usepackage{amsmath}\n`)
	 *
	 * if used as a function, we will scan the source file for
	 * `// %preambleArg=xxx%' and xxx will be passed as the function argument
	 */
	preamble?: string | ((x?: string) => string);
	/**
	 * Default content to be placed after the `\begin{document}` command
	 * and before the content body
	 * (default: ``)
	 *
	 * * if used as a function, we will scan the source file for
	 * `// %preContentArg=xxx%' and xxx will be passed as the function argument
	 */
	preContent?: string | ((x?: string) => string);
	/**
	 * Default content to be placed after the content body
	 * and before the `\end{document}` command
	 * (default: ``)
	 *
	 * * * if used as a function, we will scan the source file for
	 * `// %postContentArg=xxx%' and xxx will be passed as the function argument
	 */
	postContent?: string | ((x?: string) => string);
}

export interface MathlifiedTsOptions extends LatexOptions {
	/**
	 * In addition to tex and pdf files, we can also emit
	 * tex snippets of just the content (without the begin document commands, etc)
	 * in the output/snippets folder.
	 *
	 * This can help facilitate combining multiple files into a larger
	 * single document at a later date
	 *
	 * (default: true)
	 */
	emitSnippets?: boolean;
}

export interface MathlifiedOptions extends MathlifiedTsOptions {
	/**
	 * Generates default post/qn/qns
	 * Svelte Components and content handlers
	 * on buildStart if they are absent
	 * (default: true)
	 * */
	generateDefaults?: boolean;

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
	/**
	 * An object of the form `{
	 * 	extName: {
	 * 		latexOptions?: LatexOptions;
	 * 	}
	 * }`
	 * to add custom extensions for the plugin to handle
	 *
	 * (default: {})
	 *
	 * For example, say we create a new extension 'article'
	 * so that our plugin tracks `src/routes/[**]/_article.ts` (or js)
	 *
	 * These ts/js files (which we will call the source files)
	 * need to export an object named "article",
	 *
	 * We then have to create component at
	 * `src/lib/mathlified/components/Article.svelte`
	 * that takes in a prop named "article".
	 *
	 * We also have to create a content handler at
	 * `src/lib/mathlified/content-handlers/article.ts` (or js)
	 * which will export a function contentHandler(article)
	 * which takes in the article object exported by the source
	 * files and produces a texString (remember to escape backslashes!)
	 * which will be used as "content" in generating
	 * the TeX and pdf files.
	 *
	 */
	exts?: { [key: string]: ExtensionOptions };
	/**
	 * An object of the form `{
	 * 	texExtName: {
	 * 		texToHtml: (x: string)=>[string, Set<string>],
	 * 		texToTex: (x: string)=>string,
	 * 		latexOptions?: LatexOptions;
	 * 		svelteScripts?: string;
	 * 		sveltePreContent?: string;	 *
	 * 		sveltePostContent?: string;	 *
	 * 	}
	 * }`
	 * to add custom tex extensions for the plugin to handle
	 *
	 * (default: {'mathlified': ...} inspect our source code to find out more)
	 *
	 * For example, say we create a new extension 'article'
	 * so that our plugin tracks `src/routes/[**]/_article.tex`,
	 * which we will call the source file
	 *
	 * The texToTex function will take the source file and return
	 * a string of valid TeX markup to be used as "content" in generating
	 * the TeX and pdf files. This facilitates us to use non-standard markup
	 * in our article.tex extension
	 *
	 * The texToHtml function will take the source file and return
	 * [html, mathlifierFns?]. In the generated `+page.svelte` file, we have
	 * the structure
	 * `
	 * <script lang="ts">
	 * 	import { [mathlifierFns] } from 'mathlifier' // if the set is non-empty
	 * 	[svelteScripts]
	 * </script>
	 *
	 * [sveltePreContent]
	 * <div>
	 * 	[html]
	 * </div>
	 * [sveltePostContent]
	 *
	 */
	texExts?: { [key: string]: TexExtensionOptions };
}
