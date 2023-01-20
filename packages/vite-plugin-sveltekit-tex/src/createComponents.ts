import path from 'path';
import fs from 'fs-extra';

export async function createComponents(): Promise<void> {
	const exists: string[] = [];
	['post', 'qn', 'qns'].forEach((ext) => {
		const name = ext[0].toUpperCase() + ext.slice(1);
		try {
			const sveltePath = path.resolve(
				`./node_modules/vite-plugin-sveltekit-tex/dist/${name}.svelte`,
			);
			const copyPath = path.resolve(`./src/lib/mathlified/components/${name}.svelte`);
			fs.copySync(sveltePath, copyPath, { overwrite: false, errorOnExist: true }),
				console.log(`Mathlified: ${name} component generated`);
		} catch (err) {
			exists.push(name);
		}
	});
	if (exists.length !== 0) {
		console.log(`Mathlified: ${exists} components exist and are not replaced.`);
	}
}
