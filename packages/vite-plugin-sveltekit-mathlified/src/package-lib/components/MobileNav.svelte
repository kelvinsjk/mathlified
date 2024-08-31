<script lang="ts">
	/**
	 * Mathlified Mobile Nav version %version%
	 * generated on %date%
	 *
	 * 40 rem breakpoint (controlled at base layout.svelte)
	 */
	import Nav from './Nav.svelte';
	import { navigating } from '$app/stores';
	let popoverElement: HTMLElement;
	$effect(() => {
		if ($navigating) {
			popoverElement?.hidePopover();
		}
	});
</script>

<div class="mobile-nav-button-container">
	<button id="mobile-nav-menu-button" aria-label="Menu" popovertarget="mobile-nav-container">
		<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"
			><path
				d="M3 8h18a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2Zm18 8H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Zm0-5H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"
			></path></svg
		>
	</button>
	<nav id="mobile-nav-container" popover={''} bind:this={popoverElement}>
		<Nav />
	</nav>
</div>

<style>
	button {
		display: flex;
		align-items: center;
		padding-block: 0.25rem;
		border-radius: 25%;
		border: 0;
		box-shadow: none;
	}
	svg {
		height: 1.25rem;
		width: 1.25rem;
		color: var(--primary, hsl(240, 63%, 47%));
	}
	.mobile-nav-button-container {
		position: relative;
	}
	#mobile-nav-container:popover-open {
		/** use anchor in future for positioning?*/
		position: absolute;
		inset: unset;
		top: 3.25rem;
		right: 0;
		width: 100%;
		height: max-content;
		max-height: 75%;
		margin: 0;
		padding: 0;
		overflow-y: auto;
	}
	@media (min-width: 40rem) {
		.mobile-nav-button-container {
			display: none;
		}
	}
</style>
