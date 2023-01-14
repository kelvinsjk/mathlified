# Svelte function-based KaTeX

## Demo

<script>
  import FunctionBased from './_FunctionBased.svelte';
</script>

<FunctionBased />

## Source code

```svelte
<script>
  import { math, display } from 'mathlifier';
  let n = 2;
  $: xN = `x^{${n}}`;
</script>

<div>
  Inline math (static): {@html math('A = \\\\pi r^2')}
</div>
<div>
  Inline math (dynamic): {@html math(xN)}
</div>
<div>
  Display math: {@html display(xN)}
</div>
<button on:click={() => n++}>Reactivity: increase exponent</button>
```

## Implement this

To implement this approach, either install the [KaTeX](https://katex.org)
library or our [Mathlifier](https://www.npmjs.com/package/mathlifier) wrapper.

### Using Mathlifier

#### Install the Mathlifier library

```bash
npm i mathlifier
```

#### Importing and using Mathlifier

```svelte
<script>
  import { math, display } from 'mathlifier';
</script>
<!--inline math example-->
{@html math('ax^2+bx+c=0')}
<!--display math example-->
{@html display('ax^2+bx+c=0')}
```

#### Insert KaTeX Stylesheet

Just like in KaTeX, we will need to add a stylesheet. Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<!--in the head element of app.html-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
```

### Using KaTeX

#### Install the KaTeX library

```bash
npm i katex
```

#### Importing and using KaTeX

```svelte
<script>
  import katex from 'katex';
</script>
<!--inline math example-->
{@html katex.renderToString('ax^2+bx+c=0')}
<!--display math example-->
{@html katex.renderToString('ax^2+bx+c=0', {displayMode: true})}
```

#### KaTeX Stylesheet

```html
<!--in the head element of app.html-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
```
