import temml from 'temml';
import type { InlineMath, DisplayMath, Visitor, HTMLRenderer } from '@djot/djot';

export function djotMathOverride(options?: temml.Options): Visitor<HTMLRenderer, string> {
	return {
		inline_math: (node: InlineMath) => {
			return temml.renderToString(node.text, { ...options });
		},
		display_math: (node: DisplayMath) => {
			return temml.renderToString(node.text, { displayMode: true, ...options });
		}
	};
}
