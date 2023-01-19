import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { sveltekitTex } from 'vite-plugin-sveltekit-tex';

const config: UserConfig = {
	plugins: [sveltekit(), sveltekitTex()]
};

export default config;
