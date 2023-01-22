import path from 'path';
import fs from 'fs-extra';
import { blue, green } from 'kleur/colors';

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
	const texToHtmlPath = path.resolve(
		`./src/lib/mathlified/content-handlers/mathlifiedTexToHtml.ts`,
	);
	const texToTexPath = path.resolve(
		`./src/lib/mathlified/content-handlers/mathlifiedTexToTex.ts`,
	);
	if (fs.existsSync(texToHtmlPath)) {
		fs.copySync(
			path.resolve(
				'./node_modules/vite-plugin-sveltekit-tex/dist/mathlifiedTexToHtml.ts',
			),
			texToHtmlPath,
		);
		console.log(blue(`Mathlified: texToHtml content handler generated`));
	} else {
		exists.push('texToHtml');
	}
	if (fs.existsSync(texToTexPath)) {
		fs.copySync(
			path.resolve('./node_modules/vite-plugin-sveltekit-tex/dist/mathlifiedTexToTex.ts'),
			texToTexPath,
		);
		console.log(blue(`Mathlified: texToTex content handler generated`));
	} else {
		exists.push('texToTex');
	}
	if (exists.length !== 0) {
		console.log(`Mathlified: ${exists} content handlers exist and are not replaced.`);
	}
}
