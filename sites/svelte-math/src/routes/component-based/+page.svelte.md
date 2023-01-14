# Svelte KaTeX Component

## Demo

<script>
  import ComponentBased from './ComponentBased.svelte';
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

### KaTeX Stylesheet

Just like in KaTeX, we will need to add a stylesheet. Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<!--in the head element of app.html-->
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
	integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
	crossorigin="anonymous"
/>
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

### Curly braces

Curly braces are used throughout Svelte as well as LaTeX markup.
For numbers (e.g. `\sqrt{2}`) the svelte-katex component will still work.

#### Dynamic behavior

For letters, like `\sqrt{x}`, Svelte will try to find a definition for the
variable `x`. For example,

```svelte
<script>
  const x = 2;
</script>
<!--This will typeset $\sqrt{2}$-->
<Katex>\sqrt{x}</Katex>
```

#### Static behavior

An error will be thrown if `x` was not defined in the earlier example, To typeset `\sqrt{x}`,
we will have to use a workaround:

```svelte
<Katex>\sqrt{'{x}'}</Katex>
```

## Comparison with function-based approach

We personally prefer the function-based approach due to two reasons:

- <abbr title="server side rendering">SSR</abbr> support
- Verbosity

## Gotchas: curly braces and escaping \

When using a component-based approached, curly braces will have be thoughtfully handled as discussed above.
This could be a pro or con depending on our desired outcome. The function-based approach avoids this problem
as all LaTeX markup is already stored as a string rather than as Svelte markup.

The one thing to be careful of when using the function-based approach is having to escape all forward slashes `\`.
So we will have to use `{@html math('\\frac{1}{3}')}` instead of `<Katex>\frac{1}{3}</Katex>` for the
component-based approach.

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
