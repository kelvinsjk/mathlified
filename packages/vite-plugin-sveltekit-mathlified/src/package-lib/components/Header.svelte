<script lang="ts">
	/**
	 * Mathlified Header version %version%
	 * generated on %date%
	 */
	let { name } = $props();
	import MobileNav from './MobileNav.svelte';
</script>

<header>
	<div class="site-name">
		<a href="/">{name}</a>
	</div>
	<div class="mobile-nav">
		<MobileNav />
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: var(--primary, hsl(240, 63%, 47%));
		color: var(--primary-content, white);
		height: 3.5rem;
	}
	@media (min-width: 40rem) {
		header {
			padding-inline-start: 1.5rem;
		}
	}
	a {
		text-decoration: none;
		font-size: 1.25rem;
		font-weight: 700;
		color: inherit;
	}
</style>
