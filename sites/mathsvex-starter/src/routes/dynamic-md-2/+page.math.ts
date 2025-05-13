import Counter from '../dynamic-svelte/Counter.svelte';

const intro = `# Mixing Svelte components and Markdown prose

For slightly more complicated situations, our \`contents\` variable can
be an Array with a mixture of string (treated as Markdown) and Svelte components.

We can even pass props into the components by creating an object.

## Demo 1
`;

const outro = `## Source code

See the source code on [GitHub]()

## Working in Svelte

For even more complicated examples (requiring careful handling of state and bindable variables), we should
use a Svelte file directly, as seen in [this example](/dynamic-svelte)`;

export const contents = [
	intro,
	Counter,
	'## Demo 2 (with props)',
	{ component: Counter, props: { r: 10, step: 1 } },
	outro
];
