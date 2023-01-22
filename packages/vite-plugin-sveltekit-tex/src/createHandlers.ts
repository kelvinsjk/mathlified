import path from 'path';
import fs from 'fs-extra';
import { green } from 'kleur/colors';

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
}
