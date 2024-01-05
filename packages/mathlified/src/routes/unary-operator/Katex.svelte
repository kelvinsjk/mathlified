<script>
	import katex from 'katex';
	const math1 = katex.renderToString('-x', { throwOnError: false });
	const math2 = katex.renderToString('-x=-x', { throwOnError: false });
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
		integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
		crossorigin="anonymous"
	/>
</svelte:head>

<h2>Katex</h2>
<p>
	{@html math1}
	<br />
	{@html math2}
</p>
