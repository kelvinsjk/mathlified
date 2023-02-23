# Getting Started

## Dependencies

We need the following dependencies to use Mathlified:

- SvelteKit
- LaTeX
- fs-extra
- Mathlifier, Mathlifier2

### SvelteKit

First, create a SvelteKit app. You can follow the
[SvelteKit Docs](https://kit.svelte.dev/) or use the following:

```sh
npm create svelte@latest my-app
```

### LaTeX

You will also need LaTeX installed on your machine. [Get a TeX distribution here.](https://www.latex-project.org/get/)

### fs-extra

fs-extra is used to generate tex files for compilation.

```sh
npm install --save-dev fs-extra
```

### Mathlifier, Mathlifier2

For anything more complicated than simple text-based blurbs, you will
probably want to use the `mathlifier` and `mathlifier2` libraries.

Together, they enable a common language for typesetting and math
that can interoperate between html and LaTeX. Look at the
[typesetting](/tutorial/typesetting) and [math](/tutorial/math) tutorials
to see them in action.

```sh
npm install mathlifier mathlifier2
```

## `vite-plugin-sveltekit-tex`

With the dependencies installed, [`vite-plugin-sveltekit-tex`](https://www.npmjs.com/package/vite-plugin-sveltekit-tex) will handle the rest.

### Install

```sh
npm install --save-dev vite-plugin-sveltekit-tex
```

### Add as vite plugin

Add Mathlified as a vite plugin in `vite.config` file

```js
// vite.config.js (or ts)
import { sveltekit } from "@sveltejs/kit/vite";
import { mathlified } from "vite-plugin-sveltekit-tex";
export default {
	plugins: [sveltekit(), mathlified()],
};
```
