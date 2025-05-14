import Source from '$lib/Source.svelte';
export const title = 'Component';

const intro = `# Component-based approach

## Overview

If you prefer a more component-based approach, we have authored
[Svelte Math](https://www.npmjs.com/package/svelte-math).

## Demo

### Static Math
`;

import Demo from './Demo.svelte';

let source = `# npm or yarn works too
pnpm i -D mathlifier
# or pnpm i -D temml
# or pnpm i -D katex`;

const Install = { component: Source, props: { source, lang: 'bash' } };

import PageSource from './Source.svelte';

const postInstall = `> Include the [Temml fonts and css](https://temml.org/docs/en/administration#installation).

## Props vs slots

The slots approach usually look cleaner, but will often lead to errors for
expressions with curly braces (which is relatively common in $\\LaTeX$).

When we use the expression \`\\frac{a}{b}\` within a slot, Svelte will try to
look for a variable named \`a\` and \`b\` and will throw an error if it can't find them.

Using props instead allow us to write \`"\\\\frac{a}{b}"\` to represent $ \\frac{a}{b} $.
If interpolation is desired, then
`;

source = `const a = 2;
const latex = \`\\\\frac{\${a}}{b}\`;`;

const postInterpolate = `will enable us to represent $ \\frac{2}{b} $.

> Remember to escape backslashes when typing $\\LaTeX$ commands in a JavaScript string!`;

const Interpolate = { component: Source, props: { source, lang: 'js' } };

export const contents = [
	intro,
	Demo,
	'## Source code',
	PageSource,
	'## Installation',
	Install,
	postInstall,
	Interpolate,
	postInterpolate
];
