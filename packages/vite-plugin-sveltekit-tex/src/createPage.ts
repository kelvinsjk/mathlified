import fs from 'fs-extra';
import path from 'path';
import { outdent } from 'outdent';
import { transformTex } from './transformTex';
import { blue } from 'kleur/colors';

/**
 * create +page.svelte file in the src/routes folder
 */
export async function createPage(file: string, ext: string): Promise<void> {
	const data = svelteData(file, ext);
	const pathName = path.resolve(`./src/routes/${file}/+page.svelte`);
	try {
		fs.outputFileSync(pathName, data, { flag: 'wx' });
		console.log(blue(`Mathlified: SvelteKit Route ${file} created`));
	} catch (err) {
		console.log(`Mathlified: routes${file} detected and is unchanged`);
	}
}

function svelteData(file: string, ext: string): string {
	const Component = ext[0].toUpperCase() + ext.slice(1);
	const data = outdent`
			<script>
				import { ${ext} } from '$lib/mathlified${file}.${ext}';
				import ${Component} from '$lib/mathlified/components/${Component}.svelte';
			</script>
			
			<${Component} { ${ext} } />
	`;
	return data;
}

/**
 * create +page.svelte file in the src/routes folder
 */
export async function createTexPage(
	route: string,
	read: () => string | Promise<string>,
): Promise<void> {
	const data = await read();
	const pathName = path.resolve(`./src/routes/${route}/+page.svelte`);
	const [texData, envs] = transformTex(data);
	const importStatement =
		envs.size === 0
			? ''
			: outdent`
				<script lang='ts'>
					import { ${Array.from(envs).join(', ')} } from 'mathlifier';
				</script>\n\n
			`;
	const pageData =
		importStatement +
		outdent`
		<svelte:head>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0" crossorigin="anonymous">
		</svelte:head>

		<div>
		${texData}
		</div>
	`;

	fs.outputFileSync(pathName, pageData);
	console.log(
		blue(`Mathlified: SvelteKit Route ${route} created/modified from tex file`),
	);
}
