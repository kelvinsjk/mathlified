<script lang="ts">
  /**
   * Mathlified Layout version 0.0.1
   * generated on 5/15/2025, 5:29:12 PM
   *
   * 40rem breakpoint for stack vs left sidebar ("mobile" vs "tablet")
   * 60rem breakpoint in Content.svelte to get TOC on the right ("desktop")
   */
  import type { Snippet } from 'svelte';
  import Header from '$lib/components/mathlified/Header.svelte';
  import Nav from '$lib/components/mathlified/Nav.svelte';
  import type { Snapshot } from '@sveltejs/kit';

  const name = 'Mathlified';

  let { children }: { children: Snippet } = $props();
</script>

<div class="layout-base" style="display:contents">
  <Header {name} />
  <div class="main-container">
    <nav class="sidebar">
      <Nav />
    </nav>
    <main>
      {@render children()}
    </main>
  </div>
</div>

<style>
  /* .layout-base {
		--primary-hsl: 240, 63%, 47%;
		--surface-hsl: 60, 5%, 96%;
		--primary: hsl(var(--primary-hsl));
		--primary-content: white;
		--surface: hsl(var(--surface-hsl));
		--content: black;
	} */
  .main-container {
    display: grid;
    height: calc(100vh - 3.5rem);
    height: calc(100dvh - 3.5rem);
  }
  nav,
  main {
    height: 100%;
    overflow: hidden;
  }
  nav {
    overflow-y: auto;
  }
  .sidebar {
    display: none;
  }
  :global(body) {
    margin: 0;
    width: 100%;
    height: 100dvh;
  }
  :global(*, *:before, *:after) {
    box-sizing: border-box;
  }
  @media (min-width: 40rem) {
    .main-container {
      grid-template-columns: 18rem 1fr;
    }
    .sidebar {
      display: block;
      padding-inline: 1rem;
      width: 100%;
      overflow-y: auto;
      background-color: var(--surface, hsl(60, 5%, 96%));
      border-inline-end: 1px solid var(--content, black);
    }
  }
  @media (min-width: 60rem) {
    .sidebar {
      padding-block-start: 1rem;
    }
  }
</style>
