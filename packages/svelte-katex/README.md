> We are no longer updating this component. Consider using
> [Svelte Math](https://www.npmjs.com/package/svelte-math) instead.

# Svelte KaTeX Component

A Svelte component that uses KaTeX to render math.

## QuickStart

## Install the Svelte KaTeX component

```bash
npm i svelte-katex
```

### Import and use

```svelte
<script>
  import Katex from 'svelte-katex';
</script>
<!--inline math example-->
<Katex>ax^2+bx+c=0</Katex>
<!--display math example-->
<Katex displayMode>ax^2+bx+c=0</Katex>
```

### Curly braces

Curly braces are used throughout Svelte as well as LaTeX markup, and may not
work in slots. Use the `latex` prop instead. Remember to escape any backslashes.

```svelte
<script>
  import Katex from 'svelte-katex';
  const latex = '\\frac{a}{b}';
</script>
<Katex {latex} />


## Maybe a component isn't the best approach?

### A functional approach

> While we provide this component, we think using a function is a better way to
> handle math in Svelte.

This can be done with the [mathlifier](https://www.npmjs.com/package/mathlifier)
library, or with just the [KaTeX](https://katex.org) library itself with
`katex.renderToString`.

> See the two methods and a comparison at
> [Svelte Math](https://svelte-math.vercel.app)
```
