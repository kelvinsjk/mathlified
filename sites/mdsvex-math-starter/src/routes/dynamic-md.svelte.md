# Dynamic math in markdown

<script>
  import {math, display} from 'mathlifier';
  const x = Math.ceil(Math.random()*100)
  const inlineMath = math(`x=${x}`);
  const displayedMath = display(`x^2 = ${x*x}`, {overflowAuto: false});
  const displayedMath2 = display(`x^2 = ${x*x}`);
</script>

Coding dynamic mathematical content takes an extra step

## Demo

This value {@html inlineMath} and the following are generated dynamically:

{@html displayedMath}

Reload the page to see new values.

## Source code (in markdown/mdsvex)

```svelte
<script>
  import {math, display} from 'mathlifier';
  const x = Math.ceil(Math.random()*100)
  const inlineMath = math(`x=${x}`);
  const displayedMath = display(`x^2 = ${x*x}`);
</script>

This value {@html inlineMath} and the following are generated dynamically:

{@html displayedMath2}

Reload the page to see new values.
```

## Dynamic math in svelte

[Truly dynamic and reactive content are probably better served in a svelte file instead.](./dynamic-svelte)

## KaTeX and mathlifier

[Mathlifier](https://www.npmjs.com/package/mathlifier) is my custom wrapper around the [KaTeX](https://katex.org/) library.
If you prefer to use the $KaTeX$ library instead, install `katex` and modify the source code above with

```js
import katex from 'katex'
const inlineMath = katex.renderToString(`x=${x}`);
const displayedMath = katex.renderToString(`x^2 = ${x*x}`, {displayMode: true});
```
