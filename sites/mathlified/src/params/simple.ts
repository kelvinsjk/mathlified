import type { ParamMatcher } from '@sveltejs/kit';
import simpleFiles from '../mathlified/simple.json';

export const match = ((param: string): boolean => {
	return simpleFiles.urls.some((p) => p.slice(1) === param);
}) satisfies ParamMatcher;
