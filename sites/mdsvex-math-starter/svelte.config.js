import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx',],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about pre processors
	preprocess: [mdsvex(
		{ extensions: ['.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [remarkMath],
	rehypePlugins: [rehypeKatex]})],

	kit: {
		adapter: adapter()
	}
};

export default config;
