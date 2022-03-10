<script lang="ts">
	export let current: string;
</script>

<nav class="flex gap-4 pl-2 py-4 mb-4 bg-zinc-100">
	<a sveltekit:prefetch class="dark:text-black" class:selected={current === 'home'} href="/">home</a
	>
	<a
		sveltekit:prefetch
		class="dark:text-black"
		class:selected={current === 'function'}
		href="./function-based">function</a
	>
	<a
		sveltekit:prefetch
		class="dark:text-black"
		class:selected={current === 'component'}
		href="./component-based">component</a
	>
	<a class="dark:text-black" href="https://mdsvex-math-starter.vercel.app/">mdsvex (ext)</a>
</nav>

<style>
	.selected {
		font-weight: 700;
		color: red;
	}
	a {
		text-decoration: none;
	}
</style>
