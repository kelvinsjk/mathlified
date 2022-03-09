# Welcome to mdsvex math SvelteKit starter

## Static math

With this skeleton setup we can render math
with markup almost exactly like $LaTeX$.

## Demo

The quadratic equation $ax^2+bx+c=0$ has roots

$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
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

Use [svelte-add](https://github.com/svelte-add/svelte-add)
to easily set up a SvelteKit app with your own options (e.g. with or without Typescript, ESLint, Prettier, etc).
Make sure you include mdsvex!

```bash
# create a new project in the current directory
npm init @svelte-add/kit@latest
# enter and install dependencies
cd myProject
npm i
# install remark and rehype plugin
npm i -D remark-math@2
npm i -D rehype-katex-svelte
```

### Dynamic/reactive math?

If you need dynamic and/or reactive mathematical content, install
[KaTeX](https://katex.org) or [mathlifier](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier)
(my custom wrapper around KaTeX)

```bash
# install either KaTeX (npm i katex) or mathlifier
npm i mathlifier 
```

### Add KaTeX stylesheet

Refer to the [KaTeX Documentation](https://katex.org/docs/browser.html) for more details, or add
the following into the head element.

```html
<!--in the head element of app.html-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
```

### Start developing

```bash
npm run dev
```
