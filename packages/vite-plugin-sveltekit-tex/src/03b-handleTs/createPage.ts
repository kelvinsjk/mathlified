import outdent from 'outdent';
import fs from 'fs-extra';
import path from 'path';
import { blue } from 'kleur/colors';

/**
 * create +page.svelte file in the src/routes folder
 */
export async function createPage(
	file: string,
	ext: string,
	localUrl?: string,
): Promise<void> {
	const data = svelteData(file, ext);
	const pathName = path.resolve(`./src/routes/${file}/+page.svelte`);
	try {
		fs.outputFileSync(pathName, data, { flag: 'wx' });
		console.log(blue(`Mathlified: src/routes/${file}+page.svelte created`));
	} catch (err) {
		console.log(`Mathlified: src/routes/${file}+page.svelte detected and is unchanged`);
	}
	if (localUrl) {
		console.log(blue(`Mathlified: current route at ${localUrl}${file}`));
	}
}

function svelteData(file: string, ext: string): string {
	const Component = ext[0].toUpperCase() + ext.slice(1);
	const data = outdent`
			<script>
				import { ${ext} } from './_${ext}';
				import ${Component} from '$lib/mathlified/components/${Component}.svelte';
			</script>
			
			<${Component} { ${ext} } />
	`;
	return data;
}
