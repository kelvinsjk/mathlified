import type { ParamMatcher } from '@sveltejs/kit';
import simpleFiles from '../mathlified/simple.json';

export const match = ((param: string): boolean => {
	return simpleFiles[0].some((p) => p === param);
}) satisfies ParamMatcher;
