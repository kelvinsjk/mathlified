# Mathlifier

A wrapper for KaTeX `renderToString` for inline and displayed math

---

## Why Mathlifier?

Using KaTeX with dynamic/reactive mathematical content, or
with server side rendering, typically mean calling
`katex.renderToString()` many times.

Mathlifier repackages these function calls as `math()` and `display()`, along with
3 opinions:

### Opinion 1: throwOnError: false

> While KaTeX sets throwOnError to `true` by default, we have opted to set it to false.

### Opinion 2: No line break in inline math

> By default, we wrap all inputs with braces to prevent line-breaking.

### Opinion 3: Displayed math with overflow-x: auto

> By default, we place displayed math inside a container styled with
> `overflow-x: auto`. We believe this modification makes the output more
> mobile-friendly.

## Installing Mathlified

```bash
npm i mathlified
```

## Using Mathlified

```js
// import functions
import {math, display} from 'mathlified'
// example of using these functions
const inlineMath = math('ax^2+bx+c=0');
const displayedMath = display('x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}');
```

Subsequently, attach the HTML string(s) generated to the DOM.

### KaTeX Stylesheet

Just like in KaTeX, we will need to add a stylesheet. Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
```

## Custom Mathlified options

We can disable the default behavior (opinions 2 and 3 above) of Mathlified vs regular KaTeX

```js
// example of Mathlified options
const allowBreak =  math('e^{i\\pi} = -1', {wrap: true});
const noContainer = display('\\sum_{r=1}^n = \\frac{n(n+1)}{2}', {overflowAuto: false});
```

## KaTeX options

All KaTeX options are passed along.

```js
// example of KaTeX options
const leftEqn = display('\\begin{equation} A = \\pi r^2', {leqno:true, fleqn: true});
```

## Credits

[KaTeX](https://katex.org/)

## License

[MIT](https://github.com/kelvinsjk/mathlified/blob/896289c646c1a7c8b1a6a52a74a4a22fd2d6d500/packages/mathlifier/LICENSE)
