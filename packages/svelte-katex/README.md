# Svelte KaTeX Component

A Svelte component that uses KaTeX to render math.

## QuickStart

## Install the Svelte KaTeX component

```bash
npm i svelte-katex
```

### KaTeX Stylesheet

Just like in KaTeX, we will need to add a stylesheet. Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<!--in the head element of app.html-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
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

An error will be thrown if `x` was not defined in the earlier example,  To typeset `\sqrt{x}`,
we will have to use a workaround:

```svelte
<Katex>\sqrt{'{x}'}</Katex>
```

## Maybe a component isn't the best approach?

### A functional approach

> While we provide this component, we think using a function is
> a better way to handle math in Svelte.

This can be done with the [mathlifier](https://www.npmjs.com/package/mathlifier) library,
or with just the [KaTeX](https://katex.org) library itself with `katex.renderToString`.

> See the two methods and a comparison at
> [Svelte Math]('https://svelte-math.vercel.app')
