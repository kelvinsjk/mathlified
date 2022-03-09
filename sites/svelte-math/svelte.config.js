import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import mdsvexConfig from './mdsvex.config.js';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
		mdsvex(mdsvexConfig),
	],

	kit: {
		adapter: adapter()
	},

	extensions: ['.svelte', ...mdsvexConfig.extensions],

	dir: 'svelte-katex'
};

export default config;
