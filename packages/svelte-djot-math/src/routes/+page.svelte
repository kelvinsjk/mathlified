<script lang="ts">
	import Djot from '$lib/Djot.svelte';

	const djot = `### With props
	
Inline math: $\`y\`.
This is a second component using the \`djot\` prop.

Display math: $$\`ax^2+bx+c=0.\``;

	import { codeToHtml } from 'shiki';
	const codeInstall = (async () => {
		const code = `# using pnpm
pnpm i -D svelte-djot-math

# using npm
npm i -D svelte-djot-math
`;
		return codeToHtml(code, { lang: 'bash', theme: 'github-dark' });
	})();
	const codeImport = (async () => {
		const sc = 'script';
		const code = `<${sc}>
  import Djot from 'svelte-djot-math';
</${sc}>
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code1 = (async () => {
		const code = `<Djot>
  Inline math: $\`x\`. This...
</Djot>`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code2 = (async () => {
		const code = `<script>
  const inline = "$\`y\`";
  const display = "$$\`ax^2+bx+c=0.\`";
  const djot = 
\`Inline math: $\{inline\}. This...

Display math: $\{display\}
\`;
<script>

<Djot {djot} />
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
	const code3 = (async () => {
		const code = `<Djot 
  djot={"Inline math: $\`z\`. When..."}
>
  This slot is not rendered.
</Djot>
`;
		return codeToHtml(code, { lang: 'svelte', theme: 'github-dark' });
	})();
</script>

<svelte:head><title>Svelte Djot Math</title></svelte:head>

<main>
	<h1>Svelte Djot Math</h1>
	A Svelte component to render Djot markup,with math rendered into MathML via Temml.

	<h2>Getting started</h2>

	<h3>Install</h3>

	{#await codeInstall then code}
		{@html code}
	{/await}

	<h3>Import in Svelte</h3>

	{#await codeImport then code}
		{@html code}
	{/await}

	<h2>Usage</h2>

	<h3>With slots</h3>
	<Djot>
		Inline math: $`x`. This component uses slots (we only recommend this for short strings due to
		whitespace handling in HTML)
	</Djot>

	{#await code1 then code}
		{@html code}
	{/await}

	<Djot {djot} />

	{#await code2 then code}
		{@html code}
	{/await}

	<Djot
		djot={'### Props > slots\n\nInline math: $`z`. When both props and slots are used, we render *only* the prop.'}
		>This slot is not rendered as a prop was passed</Djot
	>

	{#await code3 then code}
		{@html code}
	{/await}
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
