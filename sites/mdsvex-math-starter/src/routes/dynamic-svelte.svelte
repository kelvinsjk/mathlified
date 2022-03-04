<script context="module">
	export const prerender = true;
</script>

<script>
	import { math, display } from 'mathlifier';
	import Counter from './Counter.svelte';

	const quantities = ['area', 'circumference', 'diameter'];
	const displayedFormulas = [display('A=\\pi r^2'), display('C=2 \\pi r'), display('D=2r')];

	let r = 5;
	let i = 0;

	$: answer = generateAnswer(i, r);

	function generateAnswer(i, r) {
		if (i === 0) {
			const coeff = r === 1 ? '' : r * r;
			return math(`${coeff}\\pi\\textrm{ cm}^2`);
		} else if (i === 1) {
			return math(`${2 * r}\\pi\\textrm{ cm}`);
		} else if (i === 2) {
			return math(`${2 * r}\\textrm{ cm}`);
		}
	}
</script>

<h1>Dynamic math</h1>

<h2>Demo</h2>

<p>The formula for the {quantities[i]} of a circle is</p>

{@html displayedFormulas[i]}

<Counter bind:r />

<p>If the radius {@html math(`r=${r}\\textrm{ cm}`)}, the {quantities[i]} is {@html answer}.</p>

<div>
	<button on:click={() => (i = 0)}>area</button>
	<button on:click={() => (i = 1)}>circumference</button>
	<button on:click={() => (i = 2)}>diameter</button>
</div>
