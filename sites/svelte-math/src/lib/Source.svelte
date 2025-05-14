<script lang="ts">
  let { source, lang }: { source: string; lang: string } = $props();
  import { codeToHtml } from 'shiki';
</script>

{#await codeToHtml(source, { lang, theme: 'github-dark' })}
  <p>Loading...</p>
{:then html}
  {@html html}
{/await}