<script module lang="ts">
  import {Djot} from 'svelte-djot-math';
  import type { Visitor, HTMLRenderer } from '@djot/djot'
  import { createHighlighter } from 'shiki';
  const defaultTheme = 'catppuccin-latte';
  const highlighter = await createHighlighter({ themes: [defaultTheme], langs: ['js', 'latex', 'md', 'svelte', 'sh', 'ts'] });
  const codeToHtml = (code: string, lang: string, options?: { theme?: string }) => {
    return highlighter.codeToHtml(code, { lang, theme: options?.theme || defaultTheme });
  };
  const overrides: Visitor<HTMLRenderer, string> = {
    "code_block": (node)=>{
      const cls = `"${node.attributes?.class ?? ''}"`;
      let code = codeToHtml(node.text, node.lang ?? '');
      if (node.lang) code = `<div class="lang">${node.lang}</div>` + code;
      if (cls !== '""') code = `<div class=${cls}>${code}</div>`;
      return code;
    }
  }

  function transform(x: string): string {
	return x
				.replace(
			/(?<![\\`])\$\$(?!`)([^]+?)\$\$(?!`)/g,
			(_, match) => `$$\`${match.replaceAll('\\_', '_')}\``
		)
		.replace(
			/(?<![\\`$])\$(?![`$])([^]+?)(?<!\\)\$(?![`$])/g,
			(_, match) => `$\`${match.replaceAll('\\_', '_')}\``
		)
		.replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`');
}
</script>

<script lang="ts">
	import { invalidate, onNavigate } from '$app/navigation';
	import { tick } from 'svelte';
  // TODO: sidebar-toc
  let { data }: { data: {djot: string, title: string} } = $props();
  if (import.meta.hot) {
    import.meta.hot.on('md-update', () => {
      invalidate('md:reload');
    });
  }

  // Scroll back to top on navigation
  let proseContainer: HTMLDivElement;
  onNavigate(async ()=>{
    await tick();
    proseContainer.scrollTop = 0;
  })
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<div class="body-container">
  <div class="prose-container scrollable" bind:this={proseContainer} >
    <Djot djot={data.djot} {overrides} {transform} />
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
  :global(.prose-container p code, .prose-container li code){
    background-color: #eff1f5;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
  :global(.prose-container blockquote p code){
    background-color: #f9f9f9;
  }
  
  /** https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/ */
  :global(.prose-container blockquote) {
	background: #eff1f5;
	border-left: 10px solid #4c4f69;
  margin-inline: 1rem 0rem;
	padding: 0.25rem 0.5rem 0.25rem 1rem;
  }

  :global(.prose-container hr){
    margin-block: 2.5rem;
  }

  /** code blocks */
  :global(.prose-container div.lang) {
    background-color: #eff1f5;
    color: black;
    padding: .5rem 1rem;
    border-radius: 1rem 1rem 0 0;
    border-bottom: 1px solid #4c4f69;
    font-family: monospace;
    display: grid;
    justify-content: end;
  }
  :global(.prose-container pre.shiki) {
    padding: 1rem;
    border-radius: 0 0 1rem 1rem;
    width: 100%;
    overflow-x: auto;
    margin-block-start: 0;
  }
  :global(code:not(pre code)){
    white-space: nowrap;
  }
</style>
