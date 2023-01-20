import path from 'path';
import fs from 'fs-extra';

export async function createHandlers(): Promise<void> {
	const exists: string[] = [];
	['post', 'qn', 'qns'].forEach((ext) => {
		try {
			const handlerPath = path.resolve(
				`./node_modules/vite-plugin-sveltekit-tex/dist/${ext}.ts`,
			);
			const copyPath = path.resolve(`./src/lib/mathlified/content-handlers/${ext}.ts`);
			fs.copySync(handlerPath, copyPath, { overwrite: false, errorOnExist: true }),
				console.log(`Mathlified: ${ext} content handler generated`);
		} catch (err) {
			exists.push(ext);
		}
	});
	if (exists.length !== 0) {
		console.log(`Mathlified: ${exists} content handlers exist and are not replaced.`);
	}
}
