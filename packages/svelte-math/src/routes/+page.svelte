<script lang="ts">
	import Math from '$lib/Math.svelte';

	import { codeToHtml } from 'shiki';
	const codeInstall = (async () => {
		const code = `# using pnpm
pnpm i -D svelte-math

# using npm
npm i -D svelte-math
`;
		return codeToHtml(code, { lang: 'bash', theme: 'github-dark' });
	})();
	const codeImport = (async () => {
		const sc = 'script';
		const code = `<${sc}>
  import Math from 'svelte-math';
</${sc}>
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code1 = (async () => {
		const code = `<Math>x+1</Math>`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code2 = (async () => {
		const code = `<Math latex="x+2" />
<Math latex="\\frac{x}{3}" />
<Math latex="\\frac{x}{3}" displayMode />
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code3 = (async () => {
		const code = `<Math latex="x+4">y+5</Math>
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
</script>

<main>
	<h1>Svelte Math Component</h1>

	<h2>Getting Started</h2>
	<h3>Install</h3>
	{#await codeInstall then code}
		{@html code}
	{/await}
	<h3>Import</h3>
	{#await codeImport then code}
		{@html code}
	{/await}

	<h2>Usage</h2>
	<h3>With slots</h3>
	<p>
		The following is rendered using a slot:
		<Math>x+1.</Math>
	</p>
	{#await code1 then code}
		{@html code}
	{/await}
	<h3>With props</h3>
	<div>
		<p>
			The following is rendered using the latex prop:
			<Math latex="x+2."></Math>
		</p>
		<p>
			Using props is almost always what you will reach for for markup containing braces, as svelte
			will try to interpret them if we use a slot. For example,
			<Math latex={'\\frac{x}{3}.'} />
			Remember to escape any backslashes.
		</p>
		<p>
			Display mode can be toggled using the displayMode prop:
			<Math latex={'\\frac{x}{3}.'} displayMode />
		</p>
	</div>
	{#await code2 then code}
		{@html code}
	{/await}
	<h3>Props > Slots</h3>
	<p>
		If the component receives both props and slots, the props take precedence. For example:
		<Math latex={'x+4.'}>y+5</Math>
	</p>
	{#await code3 then code}
		{@html code}
	{/await}
	<h3>With options</h3>
	<p>
		Using macros and leqno option:
		<Math
			latex={'\\begin{equation}x \\in \\R\\end{equation}'}
			displayMode
			options={{ macros: { '\\R': '\\mathbb{R}' }, leqno: true }}
		/>
	</p>
</main>

<style>
	main {
		max-width: 80ch;
		margin-inline: auto;
	}
	:global(#Using-props code) {
		background-color: #f5f5f4;
		font-family: 'Monaco', monospace;
		padding: 0.25em;
	}
	:global(pre) {
		font-family: 'Monaco', monospace;
		max-width: 100%;
		overflow-x: auto;
		font-size: 1rem;
		line-height: 1.5;
		padding: 1rem;
	}
</style>
