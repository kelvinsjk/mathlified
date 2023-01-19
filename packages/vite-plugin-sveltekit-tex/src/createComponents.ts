import path from 'path';
import fs from 'fs-extra';

export async function createComponents(...extensions: string[]): Promise<void> {
	const promises: Promise<void>[] = [];
	extensions.forEach((ext) => {
		const name = ext[0].toUpperCase() + ext.slice(1);
		const sveltePath = path.resolve(
			`./node_modules/vite-plugin-sveltekit-tex/dist/${name}.svelte`,
		);
		const copyPath = path.resolve(`./src/lib/mathlified/components/${name}.svelte`);
		promises.push(fs.copy(sveltePath, copyPath, { overwrite: false }));
	});
	await Promise.all(promises);
	console.log('Mathlified: Components generated');
}
