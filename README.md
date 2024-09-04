# Mathlified

Exploring mathematics in the digital age

---

## What is Mathlified?

Mathlified is a monorepo containing various packages exploring the creation of
modern mathematical content.

We will cover the intersection between mathematics, mathematics education,
mathematical typesetting, and web and mobile development.

## Packages

### Mathlified framework

THe Mathlified framework, via `vite-plugin-sveltekit-mathlified` is our attempt
at helping authors create cross-platform (web for mobile and electronic use,
LaTeX pdfs for offline printouts) mathematical content.

### Svelte math site

A comparison of different ways to typeset mathematics in Svelte.
[Link to site](https://svelte-math.vercel.app). To be updated soon to reflect
new opinions.

### Mathlifier

The mathlifier library, along with source code for the Svelte Math website, has
been moved to [its own monorepo](https://github.com/kelvinsjk/mathlifier).

## Deprecated packages

### Svelte KaTeX

A Svelte component using KaTeX to typeset math. We have since released
[Svelte Math](https://www.npmjs.com/package/svelte-math), which uses MathMl
generated via Temml. We believe this is a more lightweight approach compared to
Svelte KaTeX.

[Svelte Djot Math](https://www.npmjs.com/package/svelte-djot-math) also
addresses mathematical rendering needs when mixing math with prose.

### MDsveX KaTeX starter

The Mathlified framework (via `vite-plugin-sveltekit-mathlified`) provides an
opinionated approach to using Markdown/Djot markup to author mathematical
content, with extra features on top of it. We believe there is a good overlap
between the features in Mathlified as compared to the deprecated
[mdsvex math starter](https://mdsvex-math-starter.vercel.app).

## License

[MIT](https://github.com/kelvinsjk/mathlified/blob/main/LICENSE)
