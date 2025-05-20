import type { PageServerLoad } from './$types';
import mdFiles from '../../mathlified/md.json';
import fm from 'front-matter';

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('md:reload');
	const { urls, files } = mdFiles;
	const index = urls.indexOf('/' + params.slug);
	const file = `/src/content${files[index]}`;
	const allMd = import.meta.glob('/src/content/**/*.md', {
		query: '?raw',
		import: 'default'
	});
	const md = (await allMd[file]()) as string;
	const { attributes, body } = fm<{ title?: string }>(md);
	const title = attributes?.title ?? mdFiles.titles[index];
	const djot = attributes?.title ? `# ${attributes.title}\n\n${body}` : body;
	return {
		djot,
		title
	};
};
