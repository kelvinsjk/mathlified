<nav>
	<a rel="prefetch" href="/">Static math</a>
	<a rel="prefetch" href="/dynamic-md">Dynamic math in markdown</a>
	<a rel="prefetch" href="/dynamic-svelte">Dynamic math in svelte</a>
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
