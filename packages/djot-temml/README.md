# djot-Temml

A [djot](https://djot.net/) plugin (renderHTML override) to render mathematics using
[Temml](https://temml.org/).

## Getting started

### Installation

```bash
npm i djot-temml
```

### Usage

```js
import { djotTemml } from 'djot-temml';
djot.renderHTML(
  ast,
  overrides: {
    // your other overrides,
    ...djotTemml() // ...djotTemml(options) to pass Temml options
  }
);
```

Temml options reference at [https://temml.org/docs/en/administration#options].

### Temml css

Be sure to add the [Temml css and font files](https://temml.org/docs/en/administration#fonts).

For quick setup, use the following in the `<head>` section in your HTML:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/temml@0.10.22/dist/Temml-Local.css"
  integrity="sha256-GL89LF0vE8JCUIE1pv81ae+ApDFhRt+oDbs6lS/Cirg="
  crossorigin="anonymous"
/>
```

We suggest hosting your own CSS and fonts for best results, however.

## Why we built this?

A common way to render mathematics from markdown/djot is to
parse and render the source to HTML, and then render the
mathematics contained within using
your favorite mathematics-in-HTML library
([MathJax](https://www.mathjax.org/), [KaTeX](https://katex.org/) and [Temml](https://temml.org/) for example).

With MathML now having a
[caniuse tally of more than 93%](https://caniuse.com/mathml),
we think Temml is the way forward.

With this djot plugin, we immediately render MathML via Temml during
djot's renderHTML step and do not require any post-processing.
