<script lang="ts">
	import Katex from '$lib/Katex.svelte';

	let n = 2;
	$: xN = `x^{${n}}`;
</script>

<div>
	Inline math (static): <Katex>A = \pi r^2</Katex>
</div>
<div>
	Inline math (dynamic): <Katex>{xN}</Katex>
</div>
<div>
	Display math: <Katex displayMode>{xN}</Katex>
</div>

<button class="btn" on:click={() => n++}>Reactivity: increase exponent</button>
