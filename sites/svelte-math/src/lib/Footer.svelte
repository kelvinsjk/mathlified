<script lang="ts">
  import { page } from '$app/state';
  $inspect(page.route.id);

  const pages = [
    { text: 'this', url: 'https://github.com/kelvinsjk/mathlified/tree/main/sites/svelte-math'},
    { text: 'mathlified', url: 'https://github.com/kelvinsjk/mathlified'},
    { text: 'mathlifier', url: 'https://github.com/kelvinsjk/mathlifier'}
  ];
</script>

<nav>
  <ul>
    <div>
      Github:
    </div>
      {#each pages as p}
        <li>
          <a href={p.url}>{p.text}</a>
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
    display: inline-flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding-left: 0.5rem;
  }
  div, a {
    font-family: 'sans-serif';
  }
</style>