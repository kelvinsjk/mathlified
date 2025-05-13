<nav>
	<a href="/">Static math</a>
	<a href="/dynamic-md">Dynamic math in markdown</a>
	<a href="/dynamic-svelte">Dynamic math in svelte</a>
</nav>
<hr />

<slot />

<style>
	nav {
		display: flex;
		gap: 1em;
	}
	:global(blockquote) {
		background-color: lightgrey;
		padding: 0.25em 1em;
	}
</style>
