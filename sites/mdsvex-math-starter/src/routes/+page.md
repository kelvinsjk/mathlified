# Welcome to mdsvex math SvelteKit starter

> Consider [mathsvex](https://mathsvex-starter.vercel.app) if
> mdsvex does not work for you

## Static math

With this skeleton setup we can render math
with markup almost exactly like $\LaTeX$.

## Demo

The quadratic equation $ax^2+bx+c=0$ has roots

$$
x = \frac{-b \pm \sqrt{b^2-4ac} }{2a}
$$

## Source code (in mdsvex markdown)

```latex
The quadratic equation $ax^2+bx+c=0$ has roots

$$
x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
```

---

## Clone this project

[degit](https://github.com/Rich-Harris/degit) is the fastest way to clone this project.

```bash
npx degit https://github.com/kelvinsjk/mathlified/sites/mdsvex-math-starter myProject
cd myProject
npm i
npm run dev
```

Alternatively, instructions to set things up yourself can be found on
[the README](https://github.com/kelvinsjk/mathlified/blob/main/sites/mdsvex-math-starter/README.md)

## Recreating this starter yourself

You can also recreate this starter yourself, either because
the packages are out of date in the repo, or if you
have different options (Typescript, ESLint, Prettier, etc) in mind.

### Create SvelteKit app with mdsvex

Use the [Svelte CLI](https://www.npmjs.com/package/sv)
to easily set up a SvelteKit app with your own options (e.g. with or without Typescript, ESLint, Prettier, etc).
Make sure you include mdsvex!

```bash
# run the Svelte CLI and follow the prompts
npx sv create
# enter and install the plugins
cd myProject
npm i -D remark-math@3
npm i -D rehype-katex-svelte
```

### Dynamic/reactive math?

If you need dynamic and/or reactive mathematical content, install
[KaTeX](https://katex.org).

```bash
# or pnpm
npm i katex
```

### Add stylesheets

Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<!--in the head element of app.html-->
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
	integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP"
	crossorigin="anonymous"
/>
```

If using mathlifier, then we should add the 'Temml.woff2' font and the
temml stylesheet for best performance.

```html
<!--in the head element of app.html-->
<link
	rel="stylesheet"
	href=" https://cdn.jsdelivr.net/npm/temml@0.11.6/dist/Temml-Local.min.css "
/>
```

### Start developing

```bash
npm run dev
```
