# mdsvex Math Starter

This repo can get us started displaying math using mdsvex and SvelteKit.

## Getting started

The fastest way to get started is to clone the repo with [degit](https://github.com/Rich-Harris/degit)

```bash
npx degit https://github.com/kelvinsjk/mathlified/sites/mdsvex-math-starter myProject
cd myProject
npm i
npm run dev
```

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
npm i -D remark-math@3.0.0
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
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
	integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
	crossorigin="anonymous"
/>
```

### Start developing

```bash
npm run dev
```

## Credits

- [SvelteKit](https://kit.svelte.dev/)
- [mdsvex](https://github.com/pngwn/MDsveX)
- [rehype-katex-svelte](https://github.com/kwshi/rehype-katex-svelte)
- [katex](https://katex.org/)

### Shameless plugs

- [mathlifier](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier)
