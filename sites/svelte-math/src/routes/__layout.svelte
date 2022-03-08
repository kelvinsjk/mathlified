<script>
	import '../app.css';
	import Nav from './_Nav/Nav2.svelte';
	import { page } from '$app/stores';

	const pages = {
		'/': 'home',
		'/auto-render': 'auto',
		'/component-based': 'component',
		'/function-based': 'function'
	};
	const titles = {
		home: 'Svelte Math',
		auto: 'KaTeX auto-render extension',
		component: 'Svelte KaTeX component',
		function: 'Function-based approach'
	};

	$: current = pages[$page.url.pathname];
</script>

<svelte:head>
	<title>{titles[current]}</title>
</svelte:head>

<header>
	<Nav {current} />
</header>
<slot />
<footer class="pl-2 py-4 mt-4 bg-zinc-100">
	<a class="text-blue-500 underline" rel="external" href="https://github.com/kelvinsjk/mathlified"
		>Mathlified Github</a
	>
</footer>
