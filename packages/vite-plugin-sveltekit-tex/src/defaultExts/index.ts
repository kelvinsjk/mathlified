import type { ExtensionOptions } from '../index';
import { texToHtml, texToTex } from './transformTex';

export const defaultExts: { [key: string]: ExtensionOptions } = {
	post: {},
	qn: {
		latexOptions: {
			cls: 'exam',
			preamble: '\\\\usepackage{amsmath}\n\\\\pointsinrightmargin\n\\\\bracketedpoints\n',
		},
	},
	qns: {
		latexOptions: {
			cls: 'exam',
			preamble: '\\\\usepackage{amsmath}\n\\\\pointsinrightmargin\n\\\\bracketedpoints\n',
		},
	},
};

export const defaultTexExts = {
	mathlified: {
		texToHtml,
		texToTex,
		latexOptions: {},
		sveltePreContent: `<svelte:head>+\n\t<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0" crossorigin="anonymous">\n</svelte:head>`,
	},
};
