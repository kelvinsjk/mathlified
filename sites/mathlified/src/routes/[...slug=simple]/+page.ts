import type { PageLoad } from './$types';
import simpleFiles from '../../mathlified/simple.json';

export const load: PageLoad = async ({ params }) => {
	const { urls, files } = simpleFiles;
	const index = urls.indexOf('/' + params.slug);
	const file = `/src/content/${files[index]}`;
	const mod = await import(/* @vite-ignore */ file);
	return {
		mod
	};
};
