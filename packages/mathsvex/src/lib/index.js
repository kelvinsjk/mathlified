// Reexport your entry components here

import {render} from './render.js';

/** @type {(options?: { jsExtensions?: string[], mdExtensions?: string[] }) => import('svelte/compiler').PreprocessorGroup} */
const mathsvex = (options) => {
  const { jsExtensions = ['.math.js', '.math.ts'], mdExtensions = ['.md'] } = options ?? {};
  return {
    name: 'mathsvex',
    markup: async ({ content, filename }) => {
      if (hasExtension(filename, jsExtensions)) {
        return { code: contentToSvelte(content) };
      } else if (hasExtension(filename, mdExtensions)) {
        return { code: render(content) };
      }
    }
  }
}

export { render, mathsvex };

/** @type {(filename: string|undefined, extensions: string[]) => boolean} */
function hasExtension(filename, extensions) {
  return extensions.some((ext) => filename?.endsWith(ext));
}

/** @type {(content: string) => string} */
function contentToSvelte(content) {
  const renderName = getUniqueName(content);
  return `
<script lang="ts">
  ${content}
  import { render as ${renderName}} from 'mathsvex';
</script>

<svelte:boundary>
	{@const contentsArray = Array.isArray(contents) ? contents : [contents] }
	{#each contentsArray as content}
		{#if typeof content === 'string'}
			<div class="prose-container">
				{@html ${renderName}(content)}
			</div>
		{:else if typeof content === 'function'}
			{@const contentObject = {component: content}}
			<contentObject.component />
		{:else}
			<content.component {...content.props} />
		{/if}
	{/each}
</svelte:boundary>
`;
}

/** @type {(content: string)=> string} */
function getUniqueName(content) {
  let i = 0;
  while (content.includes(`render${i}`)) {
    i++;
  }
  return `render${i}`;
}