# Mathlifier2

Mathlifier2, together with [Mathlifier](https://www.npmjs.com/package/mathlifier), provides
a set of utilities to typeset Mathematics. Mathlifier converts code into HTML-ready
KaTeX markup while Mathlifier2 converts code into LaTeX-ready markup ready to be
inserted into a `.tex` document and compiled.

[![mathlifier2 npm version](https://img.shields.io/npm/v/mathlifier2)](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier2)
[![mathlifier2 minzip size](https://img.shields.io/bundlephobia/minzip/mathlifier2)](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier2)

---

## What are the features of Mathlifier2?

The following features are unified in Mathlifier and Mathlifier2.

### Mathematical typesetting

- `math('x')` to produce `${x}$` and `math('x', {wrap: true})` to produce `$x$`
- `display('x')` to produce `$$x$$`

### Mathematical environments

- `equation('x=3')` to produce `\begin{equation} x=3 \end{equation}`
- `equationStar('')` for the `equation*` environment
- `align()`
- `alignStar()`
- `alignat('x&=2& \quad 'y&=3', 2)`
- `alignatStar()`
- `gather()`
- `gatherStar()`

### General typesetting

- `linebreak`
- `newline`
- `bold()`, `strong()`
- `emph()`, `em()`,
- `newParagraph`

## Installing Mathlifier2

```bash
npm i mathlifier2
```

## Using Mathlifier2

```js
// import functions
import { math, display } from 'mathlifier2';
// example of using these functions
const inlineMath = math('ax^2+bx+c=0');
const displayedMath = display('x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}');
```

Subsequently, attach the string(s) to a TeX document.

## Upcoming Mathlified framework

We are working on a SvelteKit + TeX framework (in the form of a Vite plugin)
that uses Mathlifier and Mathlifier2 to generate a SvelteKit website/webapp
along with TeX and pdf files all from the same codebase. Stay tuned.

## Credits

[KaTeX](https://katex.org/)

## License

[MIT](https://github.com/kelvinsjk/mathlified/blob/896289c646c1a7c8b1a6a52a74a4a22fd2d6d500/packages/mathlifier/LICENSE)
