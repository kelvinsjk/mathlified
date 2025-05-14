<script lang="ts">
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';

  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<Nav />
<main>
  {@render children()}
</main>
<Footer />

<style>
  main {
    padding: 1rem;
    font-size: 1.25rem;
    min-height: calc(100vh - 9.5rem);
  }
  :global(h1){
    margin-top: 0rem;
    font-size: 1.75em;
  }
</style>
