<script lang="ts">
  import type { Section } from '../../../mathlified';
  let { toc }: { toc: Section[] } = $props();
  import { capitalizeFirstLetter } from '$lib/utils/capitalizeFirstLetter';
  import { page as pageState } from '$app/state';
</script>

<ul>
  <li><a href="/" class:active={pageState.url.pathname === '/'}>Overview</a></li>
{#each toc as section,i}
    <li><h3>{capitalizeFirstLetter(section.name).replaceAll('-', ' ')}</h3></li>
    {#each section.pages as page,j}
      <li class:last={i===toc.length-1 && j === section.pages.length - 1}>
        <a
          class:active={pageState.url.pathname === '/' + page.path}
          href={'/' + page.path}>
          {capitalizeFirstLetter(page.name).replaceAll('-', ' ')}
        </a>
      </li>
    {/each}
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