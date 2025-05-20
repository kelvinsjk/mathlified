<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Folder } from '../../mathlified';
  let { children, data }: { children: Snippet, data: {toc: Folder} } = $props();
  const {toc} = data;
  import Nav from '$lib/components/Nav.svelte';
  import Toc from '$lib/components/Toc.svelte';
</script>

<main>
  <Nav />
  <div class="page-container">
    <div class="toc-container">
      <Toc {toc} />
    </div>
    <div class="main-page">
      {@render children()}
    </div>
  </div>
</main>

<style>
  main {
    --nav-height: 4.5rem;
    --nav-gap: 2rem;

    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;

  }
  .page-container {
    display: grid;
    grid-template-columns: auto 1fr;
    height: calc(100vh - var(--nav-height, 2.5rem));
  }
  .toc-container, .main-page, :global(.main-page .scrollable) {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .toc-container, :global(.main-page .scrollable) {
    padding-block-start: var(--nav-gap, 2rem);
  }
  .toc-container {
    max-width: max(25vw, 10rem);
    background-color: #eff1f5;
  }
</style>