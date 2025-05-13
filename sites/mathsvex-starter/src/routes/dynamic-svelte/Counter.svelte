<script lang="ts">
	import { math } from 'mathlifier';
	let {
		r = $bindable(5),
		step = 2,
	} = $props();

	$inspect(step);
</script>

<button onclick={() => (r = r > step ? r - step : 1)}> -{step} </button>
{@html math(`r=${r}`)}
<button onclick={() => r=r+step}> +{step} </button>

<style>
	button {
		padding: 0em 0.5em;
	}
</style>
