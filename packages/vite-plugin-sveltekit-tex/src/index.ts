import { type Plugin } from 'vite';
import path from 'path';
import { createPage } from './createPage';
import { createPdf } from './createPdf';
import { createComponents } from './createComponents';
import { defaultExts } from './defaultExts';

export function sveltekitTex(options?: {
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
}): Plugin {
	// handling options
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

	return {
		name: 'vite-plugin-sveltekit-tex',
		async buildStart() {
			if (generateDefaultComponents) {
				createComponents('post', 'qn', 'qns');
			}
		},
		async handleHotUpdate({ file, read }) {
			// only handle
			// src/lib/mathlified/[fileRoute].[ext].[t|j]s files
			const [match, ext, fileRoute] = matchFile(file, extList);
			if (match) {
				console.log(`Mathlified HMR: Change detected at ${fileRoute}`);
				// routes/.../+page.svelte
				createPage(fileRoute, ext);
				// tex
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
				createPdf(fileRoute, ext, read, exts[ext].contentHandler, collatedOptions, true);
			}
		},
	};
}

function mathlifiedDir(): string {
	return path.resolve('./', '/src/lib/mathlified');
}
function matchFile(file: string, extList: string[]): [true, string, string] | [false] {
	for (const extName of extList) {
		const extMatch = file.match(new RegExp(`${mathlifiedDir()}(.+).${extName}.[t|j]s`));
		if (extMatch) {
			return [true, extName, extMatch[1]];
		}
	}
	return [false];
}

export interface ExtensionOptions {
	latexOptions?: LatexOptions;
	contentHandler: (
		// eslint-disable-next-line
		extObject: any,
	) => string;
}

export interface LatexOptions {
	cmd?: string;
	cls?: string;
	docOptions?: string;
	preDoc?: string;
	preContent?: string;
	postContent?: string;
}
