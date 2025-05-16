<script lang="ts">
  /**
   * Mathlified generic Page version 0.0.1
   * generated on 5/15/2025, 5:29:12 PM
   */
  import { invalidate } from '$app/navigation';
  import Content from '$lib/components/mathlified/Content.svelte';

  const { data } = $props();

  $effect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('md-update', () => {
        invalidate('md');
      });
    }
  });
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content content={data.content} />
