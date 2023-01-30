import type { TexExtensionOptions } from '../';
import path from 'path';
import outdent from 'outdent';
import fs from 'fs-extra';
import { blue } from 'kleur/colors';
import { preContentTex, postContentTex, writePdf, normalizePath } from '../utils';

export async function handleTex(
	file: string,
	read: () => string | Promise<string>,
	texExts: { [key: string]: TexExtensionOptions },
	latexOptions: {
		latexCmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
): Promise<void> {
	const [isTrackedTex, texRoute, ext] = matchTex(file, Object.keys(texExts));
	if (isTrackedTex) {
		// create page
		createTexPage(texRoute, read, texExts[ext]);
		// copy tex and create pdf
		const collatedLatexOptions = {
			...latexOptions,
			...texExts[ext].latexOptions,
		};
		createTexPdf(texRoute, read, texExts[ext].texToTex, collatedLatexOptions);
	}
}

function matchTex(file: string, texExts: string[]): [true, string, string] | [false] {
	const mathlifiedDir = normalizePath(path.resolve('./src/lib/mathlified'));
	for (const ext of texExts) {
		const extMatch = file.match(new RegExp(`${mathlifiedDir}(.+)\\.${ext}\\.tex`));
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
): Promise<void> {
	const data = await read();
	const pathName = path.resolve(`./src/routes/${route}/+page.svelte`);
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
	console.log(
		blue(`Mathlified: SvelteKit Route ${route} created/modified from tex file`),
	);
}

/**
 * create tex and pdf in output folder
 */
export async function createTexPdf(
	texRoute: string,
	read: () => string | Promise<string>,
	texToTex: (x: string) => string,
	options: {
		latexCmd: string;
		cls: string;
		docOptions: string;
		preDoc: string;
		preContent: string;
		postContent: string;
	},
): Promise<void> {
	const outputTexPath = path.resolve(`./output/tex${texRoute}.tex`);
	const content = await read();
	const data =
		preContentTex(options, false) +
		'\n' +
		texToTex(content) +
		'\n' +
		postContentTex(options, false);
	fs.outputFileSync(outputTexPath, data);
	try {
		await writePdf(texRoute, options.latexCmd);
	} catch (err) {
		console.error(err);
	}
}
