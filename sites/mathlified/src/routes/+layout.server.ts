import type { LayoutServerLoad } from './$types';
import toc from '../mathlified/toc.json';
export const load: LayoutServerLoad = async () => {
	return {
		toc
	};
};
