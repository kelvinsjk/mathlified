<script lang="ts">
	import { invalidate } from '$app/navigation';
  // TODO: sidebar-toc
  let { data }: { data: {djot: string} } = $props();
  import {Djot} from 'svelte-djot-math';
  const djot = $derived(data.djot);

  if (import.meta.hot) {
    import.meta.hot.on('md-update', () => {
      invalidate('md:reload');
    });
  }
</script>

<div class="body-container">
  <div class="prose-container scrollable">
    <Djot {djot} />
  </div>
</div>

<style>
  .scrollable {
    padding-top: var(--nav-gap, 2rem);
  }
  .body-container {
    height: 100%;
  }
  :global(.prose-container > section > h1:first-child){
    margin-block-start: 0;
  }
  :global(.prose-container h1) {
    font-size: 2rem;
  }
  .prose-container {
    padding-inline: 1rem;
    max-width: 65ch;
  }  
  :global(.prose-container p code){
    background-color: #f9f9f9;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
  
  /** https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/ */
  :global(.prose-container blockquote) {
	background: #f9f9f9;
	border-left: 10px solid #ccc;
	margin: 0.5rem;
	padding: 0.25rem 0.5rem 0.25rem 1rem;
  }



</style>
