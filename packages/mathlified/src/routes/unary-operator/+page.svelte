<script lang="ts">
	import { mathlify } from '$lib';

	const text = mathlify`
		Currently, math-ml (via temml) doesn't support the unary minus operator.
		@${'@br'}
		${'-x'}
		@${'@br'}
		${'-x=-x'}
	`;

	import Katex from './Katex.svelte';
</script>

<div>
	<h2>Temml</h2>
	{@html text}

	<Katex />
</div>

<style>
	div {
		max-width: 65ch;
		padding-inline: 1rem;
		line-height: 1.4375rem;
	}
</style>
