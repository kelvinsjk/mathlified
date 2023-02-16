import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { mathlified } from 'vite-plugin-sveltekit-tex';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		mathlified({
			generatePageOnBuild: true,
			generatePdfOnBuild: true
		})
	]
};

export default config;
