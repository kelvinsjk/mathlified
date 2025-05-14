<script lang="ts">
  let selection: 'function' | 'component' | 'mdsvex' | 'mathsvex' = $state('function');

  const lists: Record<'function' | 'component' | 'mdsvex' | 'mathsvex', (string | [string, true])[]> = {
    function: [
      'Function generates html string to be added to Svelte via the `{@html ...}` tag',
      'Code is very readable for simple cases',
      ['Use of the @html tag present challenges for more complicated use-cases', true]
    ],
    component: [
      'Svelte Math component takes the markup either via props or slots',
      'Code is very readable if your site/app is component based',
      ["Component markup may be slightly more verbose than functional approach", true],
      ["Usage via slots may clash with Svelte's curly braces templating", true],
    ],
    mdsvex: [
      'mdsvex plus remark/rehype plugins allow for authoring math within Markdown',
      'mdsvex community and the remark/rehype ecosystem can be very useful for additional functionality',
      'Can handle simple templating between code and markup',
      ["Clashes between curly braces syntax in Latex and Svelte/mdsvex", true],
      ["Versioning of remark/rehype plugins may present challenges", true],     
    ],
    mathsvex: [
      'mathsvex handles .md files containing mathematical content',
      'mathsvex also handles .math.js files for authoring Markdown within JavaScript',
      'Can handle templating between code and markup via template literals',
      ['New and unproven so will have to deal with early adopter issues', true]
    ]
  }
</script>

<section class="selection">
  <button class:active={selection === 'function'} onclick={() => (selection = 'function')}>
    <div>
      function
    </div>
    <code>{"{@html math('x')}"}</code>
  </button>
  <button class:active={selection === 'component'} onclick={() => (selection = 'component')}>
    <div>
      component
    </div>
    <code>{"<Math>x</Math>"}</code>
  </button>
  <button class:active={selection === 'mdsvex'} onclick={() => (selection = 'mdsvex')}>
    <div>
      mdsvex
    </div>
    <code>{"_italics_ $$x$$"}</code>
  </button>
  <button class:active={selection === 'mathsvex'} onclick={() => (selection = 'mathsvex')}>
    <div>
      mathsvex
    </div>
    <code>{"*bold* $x$"}</code>
  </button>
</section>
<section class="list">
  <ul>
    {#each lists[selection] as item}
      <li class:cons={Array.isArray(item)}>{typeof item === 'string' ? item : item[0]}</li>
    {/each}
  </ul>
</section>
<div>
  <a href="/{selection}" >See demo </a>
</div>

<style>
  .selection {
    max-width: 1000px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  @media (min-width: 700px) {
    .selection {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  button {
    aspect-ratio: 1/1;
    background-color: lightgoldenrodyellow;
    cursor: pointer;
  }
  button.active {
    background-color: #f2f28d;
  }
  code {
    display: block;
    margin: 1rem;
    color: blue;
  }
  ul {
    list-style: none;
  }
  li {
    margin-block: 1rem;
  }
  li::before {
    content: "✅";
    padding-right: 0.5rem;
  }
  li.cons::before {
    content: "❌";
    padding-right: 0.5rem;
  }
</style>