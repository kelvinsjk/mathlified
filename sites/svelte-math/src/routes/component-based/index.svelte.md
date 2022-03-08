# Svelte KaTeX Component

## Demo

<script>
  import ComponentBased from './_ComponentBased.svelte';
</script>

<ComponentBased />

## Source code

```svelte
<script>
  import Katex from 'svelte-katex';

  let n = 2;
  $: xN = `x^{${n}}`;
</script>

<div>
  Inline math (static): <Katex>A = \\pi r^2</Katex>
</div>
<div>
  Inline math (dynamic): <Katex>{xN}</Katex>
</div>
<div>
  Display math: <Katex displayMode>{xN}</Katex>
</div>
<button class="btn" on:click={() => n++}>Reactivity: increase exponent</button>
```

---

## Implement this

### Install the Svelte KaTeX component

```bash
npm i svelte-katex
```

### Import and use

```svelte
<script>
  import Katex from 'svelte-katex'
</script>
// display math example
<!--inline math example-->
<Katex>ax^2+bx+c=0</Katex>
<!--display math example-->
<Katex displayMode>ax^2+bx+c=0</Katex>
```

## Comparison with function-based approach

We personally prefer the function-based approach due to two reasons:

- <abbr title="server side rendering">SSR</abbr> support
- Verbosity

## SSR support

The implementation of the function-based approach uses `katex.renderToString` which
works perfectly with SSR.

Our current component-based approach relies on `katex.render`
and Svelte's `afterUpdate` (for reactivity).
Both require DOM nodes and will not be rendered server side.

## Verbosity

We think the function-based approach more closely mimics basic LaTeX syntax:
replace `$...$` with `{@html math(...)}`, and `$$...$$` with `${@html display(...)}`.

The following examples shows the differences in source code for the two approaches, with
a combination of static math `ax^2+bx+c=0` and dynamic/reactive elements `example, root1, root2`.

### Example of a function-based source code

```svelte
<script>
  import { math, display } from 'mathlifier'
</script>

A general quadratic equation is of the form {@html math('ax^2+bx+c=0')}.

The roots of the equation
{@html display(example)}
are {@html math(root1)} and {@html math(root2)}.
```

### Example of a component-based source code

```svelte
<script>
  import Katex from 'svelte-katex'
</script>

A general quadratic equation is of the form <Katex>ax^2+bx+c=0</Katex>.

The roots of the equation
<Katex displayMode>{example}</Katex>
are <Katex>{root1}</Katex> and <Katex>{root2}</Katex>.
```
