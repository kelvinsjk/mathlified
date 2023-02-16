<script lang="ts" context="module">
	import type { Question, Part, SubPart } from '../content-handlers/qn';
	export function romanize(x: number): string {
		const tensDigit = Math.floor(x/10);
		const digit = x%10;
		const digits = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'];
		const tens = ['', 'x', 'xx', 'xxx'];
		return `${tens[tensDigit]}${digits[digit]}`;
	}
</script>

<script lang="ts">
	export let qn: Question;
	// for Qns.svelte, we do not want the title to be used
	export let showTitle = true;

	const hasMarks = "marks" in qn || (qn.parts && partsHaveMarks(qn.parts))
	function partsHaveMarks(parts: Part[]|SubPart[]): boolean {
		return parts.some(part=>{
			if (part["marks"] !== undefined){
				return true
			}
			if ("parts" in part && part["parts"] !== undefined){
				return partsHaveMarks(part.parts)
			}
			return false;
		})
	}
</script>

<svelte:head>
	{#if showTitle && "title" in qn}
		<title>{qn.title}</title>
	{/if}
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
		integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
		crossorigin="anonymous"
	/>
</svelte:head>
			
{#if (showTitle && "title" in qn)}
	<h1>{@html qn.title}</h1>
{/if}
	
<div 
	class="qn-grid"
	class:qn-grid-with-marks="{hasMarks}"
>
	<!--qn.body-->
	{#if qn.body !== undefined}
		<div class="qn-body">
			{@html qn.body}
		</div>
		{#if qn.marks !== undefined}
		<div class="marks">[{qn.marks}]</div>
		{/if}
	{/if}
	<!--qn.parts-->
	{#if qn.parts !== undefined}
	{#each qn.parts as part,i}
		{#if part.uplevel !== undefined}
			<div class="uplevel qn-body">{@html part.uplevel}</div>
		{/if}
		{@const label = String.fromCharCode(96+(part.partNo ?? i+1))}
		<div 
			class="part-label"
			class:label-right-margin={part.parts === undefined}
		>
			({label})
		</div>
		<!--qn.part.body-->
		{#if part["body"]!== undefined}
			<div class="part-body">
				{@html part.body}
			</div>
			{#if part.marks !== undefined}
			<div class="marks">[{part.marks}]</div>
			{/if}
		{/if}
		<!--qn.subparts-->
		{#if part.parts !== undefined}
		{#each part.parts as subpart,j}
			{#if subpart.uplevel !== undefined}
				<div class="uplevel part-body">{@html subpart.uplevel}</div>
			{/if}
			{@const label = romanize(subpart.partNo ?? j+1)}
			<div class="subpart-label label-right-margin">
				{label}.
			</div>
			<!--qn.subpart.body-->
			{#if subpart["body"]!== undefined}
				<div class="subpart-body">
					{@html subpart.body}
				</div>
				{#if subpart.marks !== undefined}
				<div class="marks">[{subpart.marks}]</div>
				{/if}
			{/if}
			{/each}
		{/if}
	{/each}
	{/if}
</div>

<style>
	.qn-grid {
		display: grid;
		--qn-grid-space: min(100%, 71ch);
		--qn-padding: 0.5rem;
		--part-label-width: 3ch;
		--subpart-label-width: 3ch;
		--marks-width: 0;
		grid-template-columns: var(--part-label-width) var(--subpart-label-width) calc(var(--qn-grid-space) - var(--part-label-width) - var(--subpart-label-width));
		padding: 0rem;
	}
	.qn-grid.qn-grid-with-marks {
		--qn-grid-space: min(100%, 74.5ch);
		grid-template-columns: var(--part-label-width) var(--subpart-label-width) calc(var(--qn-grid-space) - var(--part-label-width) - var(--subpart-label-width) - var(--marks-width)) var(--marks-width);
		--marks-width: 3.5ch;
	}
	.qn-body {
		grid-column: 1 / span 3;
		padding-bottom: var(--qn-padding);
	}
	.part-body {
		grid-column: 2 / span 2;
		padding-bottom: var(--qn-padding);
	}
	.subpart-body {
		padding-bottom: var(--qn-padding);
	}
	:global(.qn-body > p:last-child,
	.part-body > p:last-child,
	.subpart-body > p:last-child) {
		margin-bottom: 0;
	}
	:global(.qn-bottom-padding) {
		padding-bottom: var(--qn-padding);
	}
	.label-right-margin {
		margin-right: var(--qn-padding);
	}
	.part-label {
		grid-column: 1;
		align-self: flex-start;
		justify-self: center;
	}
	.subpart-label {
		grid-column: 2;
		align-self: flex-start;
		justify-self: flex-end;
	}
	.marks {		
		grid-column: 4;
		align-self: flex-end;
		justify-self: flex-end;
		padding-bottom: var(--qn-padding);
	}
</style>