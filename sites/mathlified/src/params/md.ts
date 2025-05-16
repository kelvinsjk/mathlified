import type { ParamMatcher } from '@sveltejs/kit';
import mdFiles from '../mathlified/md.json';

export const match = ((param: string): boolean => {
	return mdFiles[0].some((p) => p === param);
}) satisfies ParamMatcher;
