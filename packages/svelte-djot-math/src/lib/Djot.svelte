<script module lang="ts">
	import { parse, renderHTML, type HTMLRenderer, type Visitor } from '@djot/djot';
	import type { Options as TemmlOptions } from 'temml';
	import { djotMathOverride } from './djot-math-override.js';
	import { type Snippet } from 'svelte';
	import { transform as defaultTransform } from './transform.js';
</script>

<script lang="ts">

	let {
		transform = defaultTransform,
		djot,
		temmlOptions,
		djotHTMLRenderOptions,
		djotParseOptions,
		overrides,
		children
	}: {
		djot?: string;
		transform?: (x: string) => string;
		temmlOptions?: TemmlOptions;
		djotHTMLRenderOptions?: Parameters<typeof renderHTML>[1];
		djotParseOptions?: Parameters<typeof parse>[1];
		overrides?: Visitor<HTMLRenderer, string>;
		children?: Snippet;
	} = $props();
	let slot: HTMLElement | undefined = $state(undefined);
	let slotContent = $state('');
	$effect(() => {
		slotContent = slot?.innerText ?? '';
	});
	const markup = $derived(djot ?? slotContent ?? '');

	const html = $derived(
		renderHTML(parse(transform(markup), djotParseOptions), {
			overrides: { ...djotMathOverride(temmlOptions), ...overrides },
			...djotHTMLRenderOptions
		})
	);
</script>

<!-- Display rendered math-->
{@html html}

<!--Hidden slot-->
{#if children}
	<div class="svelte-djot-math-slot" bind:this={slot} style="display:none">
		{@render children()}
	</div>
{/if}
