<script lang="ts">
  /**
   * Mathlified Custom Page version 0.0.1
   * generated on 5/15/2025, 5:29:12 PM
   */
  import { invalidate } from '$app/navigation';
  
  import Exam from '$lib/components/Exam.svelte';

  const { data } = $props();

  $effect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('md-update', () => {
        invalidate('md');
      });
    }
  });

  // get copy of module (contentFile.ts);
  const modules = import.meta.glob('/src/content/5_exam/**/*.ts');
  const module = $derived(data.data.isMd ? null : modules[data.filePath]());
</script>

<svelte:head>
  <title>{data.data.title}</title>
</svelte:head>

<Exam data={data.data} {module} />
