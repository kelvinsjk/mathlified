<script lang="ts">
  import { page } from '$app/state';

  const pages = [
    '',
    'function',
    'component',
    'mdsvex',
    'mathsvex'
  ];
</script>

<nav>
  <ul>
    {#each pages as p}
      <li>
        <a class:active={page.route.id === `/${p}`} href={`/${p}`}>{p || 'home'}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    background-color: lightgoldenrodyellow;
    padding: 0.25em 1em;
  }
  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0;
  }
  a {
    font-family: sans-serif;
    color: black;
    text-decoration: none;
  }
  a.active {
    color: red;
    font-weight: 700;
  }
</style>