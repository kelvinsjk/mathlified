# Mathlified

Exploring mathematics in the digital age

---

## What is Mathlified?

Mathlified is a monorepo containing various packages exploring the creation of
modern mathematical content.

We will cover the intersection between mathematics, mathematics education,
mathematical typesetting, and web and mobile development.

## Projects

### mathsvex

Mathsvex is a Svelte preprocessor that for `.md` and `.math.js` inspired by
[mdsvex](https://github.com/pngwn/MDsveX) but with easier mathematical content
integration.

### Svelte math site

A comparison of different ways to typeset mathematics in Svelte.
[Link to site](https://svelte-math.vercel.app).

### Svelte Math Component

Svelte component to typeset math with MathML via Temml.

### Svelte Djot Math Component

Svelte component to typeset Djot markup with MathML via Temml.

### mathsvex Starter

Example starter repo to get started working with mathsvex.

## Moved

### Mathlifier

The mathlifier library, along with source code for the Svelte Math website, has
been moved to [its own monorepo](https://github.com/kelvinsjk/mathlifier).

## Under reconsideration

### Mathlified framework

THe Mathlified framework, via `vite-plugin-sveltekit-mathlified` is our attempt
at helping authors create cross-platform (web for mobile and electronic use,
LaTeX pdfs for offline printouts) mathematical content. We will likely rewrite
it sometimes in the future.

## Deprecated packages

These packages are no longer actively maintained.

### Svelte KaTeX

A Svelte component using KaTeX to typeset math. We have since released
[Svelte Math](https://www.npmjs.com/package/svelte-math), which uses MathMl
generated via Temml. We believe this is a more lightweight approach compared to
Svelte KaTeX.

### MDsveX KaTeX starter

[mdsvex math starter](https://mdsvex-math-starter.vercel.app) for gettting
started with mdsvex and KaTeX. We are focusing our efforts on mathsvex instead.

## License

[MIT](https://github.com/kelvinsjk/mathlified/blob/main/LICENSE)
