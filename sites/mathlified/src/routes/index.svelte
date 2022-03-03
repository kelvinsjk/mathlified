<script lang="ts">
	import { math, display } from 'mathlifier';
	const inlineX = math('1234x^5=3r3rw3');
	const inlineY = math('1234x^5=3r3rw3', { wrap: true });
	const displayedX = display('21546dsafas3x^6');
	const displayedY = display('21546dsafas3x^6', { overflowAuto: false });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div>
	{@html inlineX}
</div>
<div>
	{@html inlineY}
</div>

{@html displayedX}

{@html displayedY}
