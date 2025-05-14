import Source from '$lib/Source.svelte';
export const title = 'Function';

const intro = `# Functional approach

## Overview

The leading TeX-to-web conversion libraries often provide functions
to output HTML. This is very useful for SSR, and allows us to show
mathematical content when paired with the Svelte \`{@html }\` tag.

## Katex, Temml and Mathlifier

[KaTeX](https://katex.org/) is a long-standing library that can be used
for this approach.

We have recently started to prefer [Temml](https://temml.org/)
which outputs MathML so is faster and more lightweight.

For the demo below, we use our own [Mathlifier](https://github.com/kelvinsjk/mathlifier)
library. The \`math\` and \`display\` functions used here are wrappers around Temml,
with the library providing other functions to handle more advanced use cases.

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

const postInstall = `For Mathlifier and Temml, include the [Temml fonts and css](https://temml.org/docs/en/administration#installation).\\
For KaTeX use the [KaTeX css](https://katex.org/docs/browser#starter-template).

## Alternatives

### Temml`;

/* eslint-disable no-useless-escape */
source = `<script>
import temml from 'katex';
const math = temml.renderToString('\\sqrt{x}');
const display = temml.renderToString('\\sqrt{x}', { displayMode: true });
<\/script>

{@html math}`;

const TemmlSource = { component: Source, props: { source, lang: 'svelte' } };

source = `<script>
  import katex from 'katex';
  const math = katex.renderToString('\\sqrt{x}');
  const display = katex.renderToString('\\sqrt{x}', { displayMode: true });
<\/script>

{@html math}`;

const KatexSource = { component: Source, props: { source, lang: 'svelte' } };

const mathjax = `### MathJax

[MathJax](https://www.mathjax.org/) is another popular library for displaying mathematics on the web.
It has slightly more features than our options here, but will take a different approach for use
with Svelte. The {-proof-} integration is left as an exercise for the reader.`;

export const contents = [
	intro,
	Demo,
	'## Source code',
	PageSource,
	'## Installation',
	Install,
	postInstall,
	TemmlSource,
	'### KaTeX',
	KatexSource,
	mathjax
];
