<script lang="ts">
  /**
   * Mathlified generic Page version %version%
   * generated on %date%
   */
  import { invalidate } from '$app/navigation';
  import Content from '$lib/components/Content.svelte';

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
