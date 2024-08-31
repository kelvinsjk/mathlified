<script lang="ts">
  /**
   * Mathlified Nav version %version%
   * generated on %date%
   */
  //@ts-expect-error (this line will be removed during injection)
  import { nav as baseNav, type NavNode } from './nav';
  let { nested, nav: propNav }: { nested?: boolean; nav?: NavNode[] } = $props();

  const nav = propNav ?? baseNav ?? [];

  import { page } from '$app/stores';
</script>

<ul class="nav-ul">
  {#each nav as node, i}
    <li>
      {#if node.children}
        <!--opens if 
					(1) we are in this node
					(2) first folder open when in index
					(3) the next node will be this
					(3) we are in the last item in the preceding folder (3 levels deep)
				-->
        <details
          class="nav-details"
          open={$page.url.pathname.startsWith(node.slug) ||
            ($page.url.pathname === '/' && !nested && i === 0) ||
            (nav[i - 1]?.slug && $page.url.pathname === nav[i - 1].slug) ||
            $page.url.pathname === nav[i - 1]?.children?.at(-1)?.slug ||
            $page.url.pathname === nav[i - 1]?.children?.at(-1)?.children?.at(-1)?.slug ||
            $page.url.pathname ===
              nav[i - 1]?.children?.at(-1)?.children?.at(-1)?.children?.at(-1)?.slug}
        >
          <summary class:top-level={!nested}>
            <div>
              {node.name}
            </div>
            <svg
              aria-hidden="true"
              class="caret"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style="--sl-icon-size: 1.25rem;"
              ><path
                d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"
              ></path></svg
            >
          </summary>
          <svelte:self nav={node.children} nested={true} />
        </details>
      {:else}
        <a
          class:top-level={!nested}
          href={node.slug}
          class:active={$page.url.pathname.startsWith(node.slug)}
          >{node.name}
        </a>
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  a {
    display: block;
    padding: 0.5rem;
    text-decoration: none;
    color: inherit;
  }
  summary:not(.top-level) > div {
    padding: 0.5rem;
  }
  a.active {
    background-color: var(--primary, hsl(240, 63%, 47%));
    border-radius: 0.25rem;
    color: var(--primary-content, white);
  }
  .top-level {
    font-weight: 600;
    padding: 0.25rem;
    margin: 0.25rem;
    border-block: 1px solid hsla(var(--primary-hsl, 240, 63%, 47%), 0);
    transition: border-color 0.2s ease-in-out;
  }
  .top-level:hover {
    border-block: 1px solid hsla(var(--primary-hsl, 240, 63%, 47%), 1);
  }
  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1.4;
    cursor: pointer;
  }
  svg {
    width: 1em;
    height: 1em;
    transition: transform 0.2s ease-in-out;
  }
  .nav-details[open] > summary > svg {
    transform: rotate(90deg);
  }
  :global(.nav-ul .nav-ul > li) {
    margin-inline-start: 0.5rem;
    padding-inline-start: 0.5rem;
    border-inline-start: 1px solid var(--primary, hsl(240, 63%, 47%));
    transition: border-width 0.2s ease-in-out;
  }
  :global(.nav-ul .nav-ul > li:has(a:hover)),
  :global(.nav-ul .nav-ul > li:has(summary:not(.top-level) > div:hover)) {
    border-width: 5px;
  }
  * {
    margin: 0;
  }
</style>
