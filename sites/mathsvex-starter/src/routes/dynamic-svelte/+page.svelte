<script lang="ts">
	import Counter from './Counter.svelte';
	import { render } from 'mathsvex';

let r = $state(3);
const step = 1;
let quantity: 'area' | 'circumference' | 'diameter' = $state('area');

let formula = $derived.by(() => {
	if (quantity === 'area') {
		return 'A=\\pi r^2';
	} else if (quantity === 'circumference') {
		return 'C=2 \\pi r';
	} else {
		return 'D=2r';
	}
});

let val = $derived.by(() => {
	if (quantity === 'area') {
		const coeff = r === 1 ? '' : r * r;
		return `${coeff}\\pi \\text{ cm}^2`;
	} else if (quantity === 'circumference') {
		return `${2 * r}\\pi \\text{ cm}`;
	} else {
		return `${2 * r}\\text{ cm}`;
	}
});

let intro = $derived(
`# Working in Svelte

The \`render\` function can be imported from mathsvex to convert Markdown
into HTML. This allows us to still use Markdown when working within a Svelte
file to coordinate state.

We also use the \`math\` function provided by [mathlifier](https://www.npmjs.com/package/mathlifier)
to render purely mathematical content in this demo.

## Demo

The formula for the ${quantity}
of a circle is 

$$ ${formula} $$ 
`
);

let result = $derived(
	`If the radius is $ r=${r} \\text{ cm},$
	then the ${quantity} is $ ${val}. $ `
);

</script>

{@html render(intro)}

<Counter bind:r {step} />

{@html render(result)}

<div>
	<button onclick={() => (quantity = 'area')}>area</button>
	<button onclick={() => (quantity = 'circumference')}>circumference</button>
	<button onclick={() => (quantity = 'diameter')}>diameter</button>
</div>

{@html render(`## Source Code

View the source code on [GitHub]()
`)}
