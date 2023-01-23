import path from 'path';
import fs from 'fs-extra';
import { blue, green } from 'kleur/colors';

export async function createDefaults(): Promise<void> {
	createComponents();
	createHandlers();
}

export async function createComponents(): Promise<void> {
	const exists: string[] = [];
	['post', 'qn', 'qns'].forEach((ext) => {
		const name = ext[0].toUpperCase() + ext.slice(1);
		try {
			const sveltePath = path.resolve(
				`./node_modules/vite-plugin-sveltekit-tex/dist/${name}.svelte`,
			);
			const copyPath = path.resolve(`./src/lib/mathlified/components/${name}.svelte`);
			fs.copySync(sveltePath, copyPath, { overwrite: false, errorOnExist: true });
			console.log(blue(`Mathlified: ${name} component generated`));
		} catch (err) {
			exists.push(name);
		}
	});
	if (exists.length !== 0) {
		console.log(`Mathlified: ${exists} components exist and are not replaced.`);
	}
}

export async function createHandlers(): Promise<void> {
	const exists: string[] = [];
	['post', 'qn', 'qns'].forEach((ext) => {
		try {
			const handlerPath = path.resolve(
				`./node_modules/vite-plugin-sveltekit-tex/dist/${ext}.ts`,
			);
			const copyPath = path.resolve(`./src/lib/mathlified/content-handlers/${ext}.ts`);
			fs.copySync(handlerPath, copyPath, { overwrite: false, errorOnExist: true });
			console.log(green(`Mathlified: ${ext} content handler generated`));
		} catch (err) {
			exists.push(ext);
		}
	});
	if (exists.length !== 0) {
		console.log(`Mathlified: ${exists} content handlers exist and are not replaced.`);
	}
}
