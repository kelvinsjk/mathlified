import type { TexExtensionOptions, LatexOptions } from '../';
import path from 'path';
import outdent from 'outdent';
import fs from 'fs-extra';
import { blue } from 'kleur/colors';
import { preContentTex, postContentTex, writePdf, normalizePath } from '../utils';
import { ViteDevServer } from 'vite';

export async function handleTex(
	file: string,
	read: (() => string | Promise<string>) | undefined,
	server: ViteDevServer | undefined,
	texExts: { [key: string]: TexExtensionOptions },
	latexOptions: Required<LatexOptions>,
	createPage = true,
	createPdf = true,
): Promise<void> {
	const [isTrackedTex, texRoute, ext] = matchTex(file, Object.keys(texExts));
	if (isTrackedTex) {
		if (read === undefined) {
			read = () => fs.readFileSync(file).toString();
		}
		// create page
		if (createPage) {
			const localUrl =
				server === undefined
					? undefined
					: server.resolvedUrls?.local[0] ?? 'http://localhost:5173';
			createTexPage(texRoute, read, texExts[ext], localUrl);
		}
		// copy tex and create pdf
		if (createPdf) {
			const collatedLatexOptions = {
				...latexOptions,
				...texExts[ext].latexOptions,
			};
			return createTexPdf(texRoute, read, texExts[ext].texToTex, collatedLatexOptions);
		}
	}
}

function matchTex(file: string, texExts: string[]): [true, string, string] | [false] {
	const routesDir = normalizePath(path.resolve('./src/routes'));
	for (const ext of texExts) {
		const extMatch = file.match(new RegExp(`${routesDir}/(.+)_${ext}\\.tex`));
		if (extMatch) {
			return [true, extMatch[1], ext];
		}
	}
	return [false];
}

/**
 * create +page.svelte file in the src/routes folder
 */
export async function createTexPage(
	route: string,
	read: () => string | Promise<string>,
	extObj: TexExtensionOptions,
	localUrl?: string,
): Promise<void> {
	const data = await read();
	const pathName = path.resolve(`./src/routes/${route}+page.svelte`);
	const [texData, envs] = extObj.texToHtml(data);
	const importStatement =
		envs === undefined || envs.size === 0
			? ''
			: outdent`
				<script lang='ts'>
					import { ${Array.from(envs).join(', ')} } from 'mathlifier';
          ${extObj.svelteScripts ?? ''}
				</script>\n\n
			`;
	const pageData =
		importStatement +
		`${extObj.sveltePreContent ?? ''}` +
		`\n<div>\n${texData}\n</div>\n` +
		`${extObj.sveltePostContent ?? ''}`;
	fs.outputFileSync(pathName, pageData);
	console.log(blue(`Mathlified: src/routes/${route}+page.svelte created/updated`));
	if (localUrl) {
		console.log(blue(`Mathlified: current route at ${localUrl}${route}`));
	}
}

/**
 * create tex and pdf in output folder
 */
export async function createTexPdf(
	texRoute: string,
	read: () => string | Promise<string>,
	texToTex: (x: string) => string,
	options: Required<LatexOptions>,
): Promise<void> {
	const outputTexPath = path.resolve(`./output/tex/${texRoute.slice(0, -1)}.tex`);
	const content = await read();
	const data =
		preContentTex(options, false) +
		'\n' +
		texToTex(content) +
		'\n' +
		postContentTex(options, false);
	fs.outputFileSync(outputTexPath, data);
	return writePdf(texRoute, options.latexCmd);
	//try {
	//	await writePdf(texRoute, options.latexCmd);
	//} catch (err) {
	//	console.error(err);
	//}
}
