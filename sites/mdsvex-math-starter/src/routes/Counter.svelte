<script>
	import { math } from 'mathlifier';
	export let r = 5;
</script>

<button on:click={() => (r = r === 1 ? 1 : r - 1)}> - </button>
{@html math(`r=${r}`)}
<button on:click={() => r++}> + </button>

<style>
	button {
		width: 30px;
		height: 30px;
		font-size: 21px;
	}
</style>
