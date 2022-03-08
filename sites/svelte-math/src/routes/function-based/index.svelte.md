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

To implement this approach, either install the [KaTeX](https://katex.ord)
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
