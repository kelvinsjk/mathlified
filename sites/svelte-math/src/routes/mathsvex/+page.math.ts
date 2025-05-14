import Source from '$lib/Source.svelte';
import StarterButton from '$lib/StarterButton.svelte';
export const title = 'mathsvex';

const intro = `# Using mathsvex

## Overview

We wrote mathsvex with the previous discussion on [mdsvex](/mdsvex) in mind.

> This site is built with mathsvex

## Using mathsvex

### md files

Just like in mdsvex, mathsvex preprocessors transform \`.md\` files into Svelte components. Handling of
mathematical markup (powered by Temml) is built in.

Unlike mdsvex, however, we do not currently support frontmatter or mixing Svelte and markdown within \`.md\`
files.

### math.js files

To mix Svelte and markdown, we author our content in a \`.math.js\` (or ts) file. This file
should define a variable named \`contents\` which is either a string (treated as Markdown)
or an Array with a mixture of strings and Svelte components.
`;

const source = `import MyComponent from './MyComponent.svelte';
import ComponentWithProps from './ComponentWithProps.svelte';
const a = 1;

export const contents = [
	'# Writing math.js files',
	MyComponent,
	{ component: ComponentWithProps, props: { a } },
	\`Interpolation can be done via template literals. For example, $ a = \${a} $.\`
];`;

const Markup = { component: Source, props: { source, lang: 'js' } };

const starter = `## mathsvex starter

We have written a [mathsvex starter](https://mathsvex-starter.vercel.app)
for reference on how to get started.
`;

const djot = `## Djot

We keep talking about Markdown, but mathsvex actually uses
[Djot](https://djot.net/) instead of Markdown. 

The Djot syntax is very similar to Markdown, with only
[a few main differences](https://github.com/jgm/djot/blob/main/doc/quickstart-for-markdown-users.md)
to take note of. 

Markdown is awesome, but occasionally we run into edge cases where the output isn't quite what we
intended (or is different under different parsers/renderers). We have found working with Djot to be
more consistent and easier to reason about.

We're sorry for the false advertising, but for name recognition and developer tooling reason have
decided to call it "Markdown". We do hope that some day the project grows to a level where it has
immediate name recognition.

## Let's build mathsvex together

mathsvex is a new project with limited functionality outside of what is presented above. We welcome
discussion on [Github](https://github.com/kelvinsjk/mathlified/issues) for bug reports, and discussion
on potential features going forward.
`;

export const contents = [intro, Markup, starter, StarterButton, djot];
