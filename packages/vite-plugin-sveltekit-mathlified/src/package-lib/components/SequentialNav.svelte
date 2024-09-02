<script lang="ts">
  /**
   * Mathlified Sequential Nav version %version%
   * generated on %date%
   */
  import { page } from '$app/stores';
  //@ts-expect-error (this line will be removed during injection)
  import { sequentialNav } from '../nav';
  //@ts-expect-error (this line will be removed during injection)
  const index = $derived(sequentialNav.findIndex((x) => x.slug === $page.url.pathname));
  let prev = $derived(sequentialNav[index - 1]);
  let next = $derived(sequentialNav[index + 1]);
</script>

{#if prev || next}
  <nav>
    {#if prev}
      <a class="prev" href={prev.slug}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          ><path
            d="M17 11H9.41l3.3-3.29a1.004 1.004 0 1 0-1.42-1.42l-5 5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l5 5a1.002 1.002 0 0 0 1.639-.325 1 1 0 0 0-.219-1.095L9.41 13H17a1 1 0 0 0 0-2Z"
          ></path></svg
        >
        <span>{prev.name}</span>
      </a>
    {/if}
    {#if next}
      <a class="next" href={next.slug}>
        <span>{next.name}</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          ><path
            d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"
          ></path></svg
        >
      </a>
    {/if}
  </nav>
{/if}

<style>
  nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
    gap: 1rem;
    margin-block: 2rem;
  }
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--primary, hsl(240, 63%, 47%));
    text-decoration: none;
    color: var(--content, black);
  }
  a.prev {
    justify-content: flex-start;
  }
  a.next {
    justify-content: flex-end;
  }
  svg {
    height: 2rem;
    width: 2rem;
    color: var(--primary, hsl(240, 63%, 47%));
  }
</style>
