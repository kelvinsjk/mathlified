# Mathsvex

A Svelte preprocessor for working with "Markdown", with special focus on facilitating mathematical content.

## Inspiration

[mdsvex](https://github.com/pngwn/MDsveX) is the main inspiration for this project, and you should try that first if you haven't already.

We love the ability to template Markdown and mix Svelte components with mdsvex.

Unfortunately, our attempts to author mathematical content in it has met with a few challenges:

- the use of curly braces for templating in Svelte/mdsvex clashes with the extensive use of curly braces in LaTeX math
- we encounter bugs and edge cases with Markdown/the unified ecosystem mdsvex runs on (thought we definitely know user error is a big part)

This led us to create Mathsvex, where we support `.md` files for more static content, and use JavaScript files to perform our templating.

## Features

### .md files

`.md` files are processed to be Svelte components. For SvelteKit users, you can now create routes written in Markdown with `+page.md` files in the `routes` directory.

### .math.ts files

To perform interpolation and to mix Svelte components with Markdown content, we work with regular JavaScript files, and create a variable
named `contents` that is an array containing
markdown strings and Svelte components.

```js
import { Component } from './Component.svelte';
import { ComponentWithProps } from './Props.svelte';

const [a, b, c] = [2, 3, 'k'];

const markdown = `# Title

We can embed content using JavaScript template
literals, for content like $a = ${a}$.

When typing math in this way, we need to *escape* our backslashes, like in the following example.

$$ x = \\frac{-${b} \\pm \\sqrt{ ${b}^2 - 4(${a})${c} } }{ 2 (${a})  } $$`;

export const contents = [
	markdown,
	Component,
	'_more_ markdown',
	{
		component: ComponentWithProps,
		props: {
			a,
			b,
			x: 23
		}
	}
];
```

## Getting started

### Installation

### Updating the Svelte config

## Under the hood

### Djot vs Markdown

### temml for MathML
