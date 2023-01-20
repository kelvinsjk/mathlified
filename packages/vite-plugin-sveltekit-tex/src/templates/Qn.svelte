<script lang="ts" context="module">
	interface SubPart {
		body: string;
		marks?: number;
		partNo?: number;
	};
	interface Part {
		body?: string;
		marks?: number;
		parts?: SubPart[];
		partNo?: number;
	};
	export interface Question {
		title?: string;
		body?: string;
		marks?: number;
		parts?: Part[];
		partNo?: number;
	}
</script>

<script lang="ts">
	export let qn: Question;
	export let hasTitle = true;

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
	function romanize(x: number): string {
		const tensDigit = Math.floor(x/10);
		const digit = x%10;
		const digits = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'];
		const tens = ['', 'x', 'xx', 'xxx'];
		return `${tens[tensDigit]}${digits[digit]}`;
	}
</script>
			
{#if (hasTitle && "title" in qn)}
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
		{@const label = String.fromCharCode(64+(part.partNo ?? i+1)).toLowerCase()}
		<div class="part-label">({label})</div>
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
			{@const label = romanize(subpart.partNo ?? j+1)}
			<div class="subpart-label">{label}.</div>
			<!--qn.subpart.body-->
			{#if subpart["body"]!== undefined}
				<div>
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
	div {
		padding: 1rem;
	}
	.qn-grid {
		display: grid;
		max-width: 70ch;
		grid-template-columns: 3ch 3ch calc(100% - 6ch);
		padding: 0rem;
	}
	.qn-grid-with-marks {
		max-width: 75ch;
		grid-template-columns: 3ch 3ch calc(100% - 9.5ch) 3.5ch;
	}
	.qn-body {
		padding: 1rem 1rem 1rem 0;
		grid-column: 1 / span 3;
	}
	.part-body {
		grid-column: 2 / span 2;
	}
	.part-label {
		padding: 1rem 0 0;
		grid-column: 1;
		align-self: flex-start;
		justify-self: center;
	}
	.subpart-label {
		padding: 1rem 0 0;
		grid-column: 2;
		align-self: flex-start;
		justify-self: flex-end;
	}
	.marks {
		padding: 0 0 1rem;
		grid-column: 4;
		align-self: flex-end;
		justify-self: flex-end;
	}
</style>