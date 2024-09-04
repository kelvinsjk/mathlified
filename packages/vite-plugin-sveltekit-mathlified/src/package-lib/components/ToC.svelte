<script lang="ts">
  /**
   * Mathlified ToC component version %version%
   * generated on %date%
   */
  import type { Heading } from './Content.svelte';

  let {
    toc,
    currentSection = ''
  }: {
    toc: Heading[];
    currentSection?: string;
  } = $props();
</script>

<ul class="toc">
  {#each toc as heading}
    {@const id = heading.text
      .replace(/[\]\[~!@#$%^&*(){}`,.<>\\|=+/?\s]+/g, ' ')
      .trim()
      .replace(/ +/g, '-')}
    <!-- https://github.com/jgm/djot.js/blob/main/src/parse.ts getUniqueIdentifier -->
    <li class:active={currentSection === id}><a href={`#${id}`}>{heading.text}</a></li>
    {#if heading.children}
      <svelte:self toc={heading.children} {currentSection} />
    {/if}
  {/each}
</ul>

<style>
  .active {
    color: var(--active);
  }
  .toc li a {
    display: block;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: inherit;
  }
  .toc li a:hover {
    color: revert;
  }
  ul.toc {
    margin: 0;
    padding: 0;
    margin-inline-start: 1rem;
    list-style-type: none;
    line-height: 2;
  }
</style>
