import type { ParamMatcher } from '@sveltejs/kit';
import mdFiles from '../mathlified/md.json';

export const match = ((param: string): boolean => {
	return mdFiles.urls.some((p) => p.slice(1) === param);
}) satisfies ParamMatcher;
