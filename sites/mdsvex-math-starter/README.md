# create-svelte

## Getting started

Clone this repo

## Creating a project

Steps to recreate this starter:

### Create SvelteKit app with mdsvex

Use svelte-add to easily set up a SvelteKit app with your own options (e.g. with or without Typescript, ESLint, Prettier, etc).
Make sure you include mdsvex!

```bash
# create a new project in the current directory
npm init @svelte-add/kit@latest
# enter and install dependencies
cd myProjectName
npm i
# install remark and rehype plugin
npm i -D remark-math@2
npm i -D rehype-katex-svelte
```

### Dynamic/reactive math?

If you need dynamic and/or reactive mathematical content, install
KaTeX or mathlifier (my own wrapper around KaTeX)

```bash
# install either KaTeX or mathlifier
npm i mathlifier
# npm i katex
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
