<script lang="ts" context="module">
	import type { Question } from './Qn.svelte';
	export interface Questions {
		title?: string;
		qns: Question[];
		ans?: Question[];
	}
</script>

<script lang="ts">
	import Qn from './Qn.svelte';
	export let qns: Questions;
</script>

<svelte:head>
	{#if "title" in qns}
		<title>{qns.title}</title>
	{/if}
</svelte:head>

{#if "title" in qns}
	<h1>{@html qns.title}</h1>
{/if}

{#if "ans" in qns}
<h2>Questions</h2>
{/if}
	
<div 
	class="qns-grid"
>
	{#each qns.qns as qn,i}
		<div class="qn-label">{qn["partNo"] ?? i+1}.</div>
		<Qn {qn} showTitle={false} />
	{/each}
</div>

{#if qns["ans"] !== undefined}
<hr />
<h2>Answers</h2>
<div 
	class="qns-grid"
>
	{#each qns.ans as ans,i}
		<div class="qn-label">{ans["partNo"] ?? i+1}.</div>
		<Qn qn={ans} showTitle={false} />
	{/each}
</div>
{/if}

<hr />

<style>
	.qns-grid {
		display: grid;
		--qns-grid-space: min(100%, 77ch);
		grid-template-columns: 2.5ch calc(var(--qns-grid-space) - 2.5ch);
		padding: 0rem;
	}
	.qn-label {
		grid-column: 1;
		align-self: flex-start;
		justify-self: flex-start;
	}
</style>