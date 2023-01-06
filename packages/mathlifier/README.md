# Mathlifier

A wrapper for KaTeX `renderToString` for inline and displayed math

[![mathlifier npm version](https://img.shields.io/npm/v/mathlifier)](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier)
[![mathlifier minzip size](https://img.shields.io/bundlephobia/minzip/mathlifier)](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier)

---

## Why Mathlifier?

Using KaTeX with dynamic/reactive mathematical content, or
with server side rendering, typically mean calling
`katex.renderToString()` many times.

Mathlifier repackages these function calls as `math()` and `display()`, along with
3 opinions:

### Opinion 1: throwOnError: false

> While KaTeX sets throwOnError to `true` by default, we have opted to set it to false

We think that this facilitates quicker debugging (especially useful when hot module reloading (HMR) is active).

### Opinion 2: No line break in inline math

> By default, we wrap all inputs with braces to prevent automatic line-breaking.

Disable this with an [option](#custom-mathlifier-options)

### Opinion 3: Displayed math with overflow-x: auto

> By default, we place displayed math inside a container styled with
> `overflow-x: auto`. We believe this modification makes the output more
> mobile-friendly.

Disable this with an [option](#custom-mathlifier-options)

## Installing Mathlifier

```bash
npm i mathlifier
```

## Using Mathlifier

```js
// import functions
import { math, display } from 'mathlifier';
// example of using these functions
const inlineMath = math('ax^2+bx+c=0');
const displayedMath = display('x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}');
```

Subsequently, attach the HTML string(s) generated to the DOM.

### KaTeX Stylesheet

Just like in KaTeX, we will need to add a stylesheet. Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
	integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
	crossorigin="anonymous"
/>
```

## Custom Mathlifier options

We can disable the default behavior (opinions 2 and 3 above) of Mathlifier vs regular KaTeX

```js
// example of Mathlifier options
const allowBreak = math('e^{i\\pi} = -1', { wrap: true });
const noContainer = display('\\sum_{r=1}^n = \\frac{n(n+1)}{2}', { overflowAuto: false });
```

## KaTeX options

All [KaTeX options](https://katex.org/docs/options.html) are passed along.

```js
// example of KaTeX options
const leftEqn = display('\\begin{equation} A = \\pi r^2 \\end{equation}', {
	leqno: true,
	fleqn: true,
});
```

## Other features

We also have quick wrappers for four of the commonly used display environments: `align`, `align*`, `gather`, `gather*`.

```js
// display environments
import { align, alignStar, gather, gatherStar } from 'mathlifier';
const gatherEnv = alignStar(`
  x+3y &= 3 \\\\
  2x-y &= -2
`);
// equivalent to
// display(`\\begin{align*}
//   x+3y &= 3 \\\\
//   2x-y &= -2
// \\end{align*}
// `);
```

### Typesetting Utils

We have also added `linebreak` (to add the html `<br>` tag) and the function `bold(x)`
(to wrap `x` in the `<strong></strong>` environment).

This is to facilitate using the same javascript code to generate both HTML (via KaTeX)
and LaTeX by swapping out this library for an upcoming package (Mathlifier2?).

## Credits

[KaTeX](https://katex.org/)

## License

[MIT](https://github.com/kelvinsjk/mathlified/blob/896289c646c1a7c8b1a6a52a74a4a22fd2d6d500/packages/mathlifier/LICENSE)
