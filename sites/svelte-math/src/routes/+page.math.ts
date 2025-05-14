export const title = 'Svelte Math';

const intro = `# Svelte Math

Svelte $ \\mu \\alpha \\theta \\eta \\mu \\alpha $.

$$ \\text{e}^{\\text{i}\\pi} = -1 $$

---

## Displaying mathematics in Svelte and SvelteKit

We investigate and showcase various methods of displaying mathematics in Svelte and SvelteKit.

### Sprinkles of math

If all you need is a dash of mathematical content on your site/app, we think using a [function](/function) or
a [component](/component) is the way to go.

### Mixing math and prose

For sites/apps that require a lot more mathematical content, especially when interspersed with prose,
we recommend a more full-fledged approach. 

[mdsvex](/mdsvex) is an established way to work with Markdown in Svelte, with math functionality
enabled through remark/rehype plugins.

Inspired by mdsvex, we have also created [mathsvex](/mathsvex) as an alternative approach to Markdown-based
content in Svelte.

---

## Comparison

`;

import Comparison from './Comparison.svelte';

export const contents = [intro, Comparison];
