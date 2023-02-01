# Plugin configs

You can add config options to `vite-plugin-sveltekit-tex`
to modify the behavior of Mathlified.

They can be used to modify the behavior of
the plugin and to customize LaTeX output as well as add custom extensions.

```ts
// vite.config.ts
import type { UserConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { mathlified } from "vite-plugin-sveltekit-tex";

const config: UserConfig = {
	plugins: [
		sveltekit(),
		mathlified({
			docOptions: "a4paper,12pt",
		}),
	],
};

export default config;
```

## Plugin options

### generateDefaults

(`boolean`, default `true`). Whether the Svelte components and content handlers for the
default post/qn/qns extensions will be generated on startup.

### emitSnippets

(`boolean`, default `true`). Whether the tex "snippets" are output (in addition)
to the fully formed tex file. Useful for combining your content
into a larger document.

### generatePdfOnBuild

(`boolean`, default `false`). Whether the tex and pdfs will be generated at build time.
We do the generation on HMR so this is disabled by default.

### generatePageOnBuild

(`boolean`, default `false`). Whether the SvelteKit `+page.svelte`
route will be generated at build time.
We do the generation on HMR so this is disabled by default.

### tsxCmd

(`string`, default `tsx`)

Mathlified currently produces a texGenerator.ts file which is written to
disk. To generate the TeX file for compilation, we then have to run this
file. By default, we will use [tsx](https://www.npmjs.com/package/tsx),
so this will ideally be installed globally on your machine.

```sh
npm install --global tsx
```

Alternatively, you can also change this config option
to commands like `npx tsx` or `pnpm dlx` to avoid global installation.

### latexCmd

(`string`, default `xelatex`) The LaTeX command to compile the generated
tex file. Other common commands are `pdflatex` and `lualatex`.

### LaTeX options

The following plugin options can be used to modify the generated
LaTeX output:

- `cls`: (default `article`) the document class
- `docOptions`: (empty default) options for the document class
- `preamble`: (default `\usepackage{amsmath}`) preamble before the `\begin{document}` command
- `preContent`: (empty default) content to be placed after the `\begin{document}` command and before the regular content
- `postContent`: (empty default) content to be placed before the `\end{document}` command and after the regular content

### Custom extensions

The `exts` and `texExts` plugin options allow you to define your custom js/ts and tex
extensions respectively and will be covered in more depth in the next section.

## Plugin config API

```ts
interface MathlifiedOptions {
	/**
	 * Generates default post/qn/qns
	 * Svelte Components and content handlers
	 * on buildStart if they are absent
	 * (default: true)
	 * */
	generateDefaults?: boolean;
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
	 * tsx command.
	 * by default, we have tsx installed globally on the machine
	 *
	 * should be changed to "npx tsx" or "pnpm dlx tsx" or "pnpm tsx", etc
	 * if tsx not installed globally
	 * (default "pnpm dlx")
	 */
	tsxCmd?: string;
	/**
	 * Default command to use when running node-latex
	 * (can be overridden by custom extension options)
	 * (default: 'xelatex')
	 */
	latexCmd?: string;

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
	preamble?: string;
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
	 * 	}
	 * }`
	 * to add custom extensions for the plugin to handle
	 *
	 * (default: {})
	 *
	 * For example, say we create a new extension 'article'
	 * so that our plugin tracks `src/lib/mathlified/[xxx].article.ts` (or js)
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
	 * so that our plugin tracks `src/lib/mathlified/[xxx].article.tex`,
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
```
