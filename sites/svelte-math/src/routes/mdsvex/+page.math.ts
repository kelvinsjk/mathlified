import Source from '$lib/Source.svelte';
import StarterButton from '$lib/StarterButton.svelte';
export const title = 'mdsvex';

const intro = `# Using mdsvex

## Overview

The functional or component-based approaches tend to get a bit unwieldy with
larger amounts of mathematical content. You can try to roll your own solutions
using a combination of those concepts.

A Markdown-based approach is particular useful for sites/apps that have
frequent intermixing between prose and mathematical content. Writing our
markup now becomes very similar to (or even easier than) writing in $\\LaTeX$,
with the usage of \`$\` and \`$$\` delimiters.

## mdsvex

Enter mdsvex, arguably the most established Markdown-based solution in the Svelte
ecosystem. It is even integrated into the Svelte CLI!

### Plugins for mathematical content

By default mdsvex does not handle mathematical content. To enable support, we install
[remark-math version 3](https://www.npmjs.com/package/remark-math) and
[remark-katex-svelte](https://www.npmjs.com/package/rehype-katex-svelte).
`;

let source = `# npm or yarn works too
pnpm i -D remark-math@3
pnpm i -D rehype-katex-svelte`;

const Install = { component: Source, props: { source, lang: 'js' } };

const config = `> Note that as of writing version 3 of remark-math is needed. The later versions do not work.

We then add these plugins into the svelte/mdsvex config.`;

source = `import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex-svelte';

export default {
	extensions: ['.svelte', '.svx', '.md'],
  preprocess: mdsvex({ 
		extensions: ['.svx', '.md'],
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex]
	}),
}`;

const Config = { component: Source, props: { source, lang: 'js' } };

const starter = `## mdsvex math starter

Consider using
[mdsvex math SvelteKit starter](https://mdsvex-math-starter.vercel.app/) for reference and
instructions to set things up yourself
`;

const braces = `## Potential problems with mdsvex

### Curly braces

mdsvex's ability to integrate Markdown and Svelte (and the associated templating
via curly braces) is remarkably powerful.

Unfortunately, much of $\\LaTeX$ markup
uses curly braces. Typesetting \`\\frac{a}{b}\` runs into trouble as mdsvex/Svelte
will try to look for the variables \`a\` and \`b\` to interpolate into the expression.

Our personal attempts at workarounds (e.g. handling all such expressions with strings)
have been cumbersome at best, unfortunately.

### The remark/rehype ecosystem versions

The [unified remark/rehype ecosystem](https://unifiedjs.com/) powering mdsvex at the moment
is both a boon and a bane in our work with mdsvex. 

The assortment of plugins provide all sorts of useful additional functionality. At the same
time, we have struggled with issues relating to versioning. As of writing mdsvex is running on
version 9 of the unified ecosystem, while the current latest version is v11. When finding plugins
to use with mdsvex, you will have to find the correct version that is compatible.

## Alternatives

Writing your own Markdown pipeline is a potential avenue.

[Svelte Markdown](https://www.npmjs.com/package/svelte-markdown) seems like a component-based approach
to rendering Markdown and have high usage numbers, though we haven't tried it ourselves.

Our own [mathlifier](https://www.npmjs.com/package/mathlifier) library
is also attempting to solve this problem in a functional way, with a focus on interpolating mathematical
expressions via template literals, though that is very much a work in progress. We are more than happy to have
you try and give feedback on that project.

Finally, we have also written [mathsvex](/mathsvex) to hopefully provide a mdsvex-like experience
that works well with mathematical content.
`;

export const contents = [
	intro,
	Install,
	config,
	Config,
	starter,
	{ component: StarterButton, props: { mdsvex: true } },
	braces
];
