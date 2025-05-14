# mdsvex Math Starter

This repo can get us started displaying math using mathsvex and SvelteKit.

## Getting started

The fastest way to get started is to clone the repo with [degit](https://github.com/Rich-Harris/degit)

```bash
npx degit https://github.com/kelvinsjk/mathlified/sites/mathsvex-starter myProject
cd myProject
npm i
npm run dev
```

## Recreating this starter yourself

You can also recreate this starter yourself, either because
the packages are out of date in the repo, or if you
have different options (Typescript, ESLint, Prettier, etc) in mind.

### Create SvelteKit app with sv

```bash
# create a new sveltekit project
npx sv create
# enter and install mathsvex
cd myProject
npm i -D mathsvex
```

### Add preprocessor

We need to add extensions and the `mathsvex` preprocessor to the `svelte.config.js` file.

```js
// svelte.config.js
import mathsvex from 'mathsvex';
export default {
  extensions: ['.svelte', '.md', '.math.js', '.math.ts'],
  preprocess: [vitePreprocess(), mathsvex()],
  ...
};
```

### Add font and stylesheet

Refer to the [Temml Documentation](https://temml.org/) for more details, or add
the following into the head element.

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

## Credits

- [SvelteKit](https://kit.svelte.dev/)
- [djot](https://djot.net/)
- [temml](https://temml.org/)

Inspired by [mdsvex](https://github.com/pngwn/MDsveX)

### Shameless plugs

- [mathlifier](https://github.com/kelvinsjk/mathlified/tree/main/packages/mathlifier)
