<script lang="ts">
  /**
   * Mathlified Custom Page version %version%
   * generated on %date%
   */
  import { invalidate } from '$app/navigation';
  //@ts-expect-error (this line will be removed during injection)
  import CustomComponent from '$lib/components/%Collection%.svelte';

  const { data } = $props();

  $effect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('md-update', () => {
        invalidate('md');
      });
    }
  });

  // get copy of module (contentFile.ts);
  const modules = import.meta.glob('/src/content/%collection-filename%/**/*.ts');
  const module = $derived(data.data.isMd ? null : modules[data.filePath]());
</script>

<svelte:head>
  <title>{data.data.title}</title>
</svelte:head>

<CustomComponent data={data.data} {module} />
