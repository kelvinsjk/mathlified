<script lang="ts">
  import type { Folder } from '../../../mathlified';
  let { toc }: { toc: Folder } = $props();
  import { capitalizeFirstLetter } from '$lib/utils/capitalizeFirstLetter';
  import { page as pageState } from '$app/state';
</script>

<ul>
  <li><a href="/" class:active={pageState.url.pathname === '/'}>Overview</a></li>
{#each toc.contents as section,i}
    <li><h3>{capitalizeFirstLetter(section.name).replaceAll('-', ' ')}</h3></li>
    {#if 'directoryPath' in section}
    {#each section.contents as page,j}
      {#if 'filePath' in page}
      <li class:last={i===toc.contents.length-1 && j === section.contents.length - 1}>
        <a
          class:active={pageState.url.pathname === page.url}
          href={page.url}>
          {capitalizeFirstLetter(page.name).replaceAll('-', ' ')}
        </a>
      </li>
      {/if}
    {/each}
    {/if}
    {/each}
  </ul>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0 1rem;
    height: 100%;
  }
  a {
    text-decoration: none;
    color: black;
  }
  a:hover, a.active {
    text-decoration: underline;
  }
  a.active {
    color: darkgoldenrod;
  }
  li.last {
    padding-bottom: 1rem;
  }
</style>