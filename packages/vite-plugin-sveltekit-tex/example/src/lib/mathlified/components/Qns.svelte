<script lang="ts" context="module">
	import type { Question } from './Qn.svelte';
	export interface Questions {
		title?: string;
		qns: Question[];
	}
</script>

<script lang="ts">
	import Qn from './Qn.svelte';
	export let qns: { title?: string, qns: Question[] };
</script>
			
{#if "title" in qns}
	<h1>{@html qns.title}</h1>
{/if}
	
<div 
	class="qns-grid"
>
	{#each qns.qns as qn,i}
		<div class="qn-label">{qn["partNo"] ?? i+1}.</div>
		<Qn {qn} hasTitle={false} />
	{/each}
</div>

<style>
	.qns-grid {
		display: grid;
		max-width: 80ch;
		grid-template-columns: 2.5ch calc(100% - 2.5ch);
		padding: 0rem;
	}
	.qn-label {
		padding: 1rem 0 0;
		grid-column: 1;
		align-self: flex-start;
		justify-self: flex-start;
	}
</style>