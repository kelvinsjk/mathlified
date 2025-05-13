declare module 'render' {
	export function render(markup: string): string;
	export type Overrides = Exclude<Parameters<typeof renderHTML>[1], undefined>['overrides'];
	import { renderHTML } from '@djot/djot';
}
declare module 'mathsvex' {
	import { render } from 'render';
	/** @type {(options?: { jsExtensions?: string[], mdExtensions?: string[] }) => import('svelte/compiler').PreprocessorGroup} */
	export const mathsvex: (options?: {
		jsExtensions?: string[];
		mdExtensions?: string[];
	}) => import('svelte/compiler').PreprocessorGroup;
	export { render };
}
