# Getting Started

## Dependencies

We need the following dependencies to use Mathlified:

- SvelteKit
- LaTeX
- Mathlifier, Mathlifier2
- fs-extra

### SvelteKit

First, create a SvelteKit app. You can follow the
[SvelteKit Docs](https://kit.svelte.dev/) or use the following:

```sh
npm create svelte@latest my-app
```

### LaTeX

You will also need LaTeX installed on your machine. [Get a TeX distribution here.](https://www.latex-project.org/get/)

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

### tsx

Mathlified currently produces a texGenerator.ts file which is written to
disk. To generate the TeX file for compilation, we then have to run this
file. By default, we will use [tsx](https://www.npmjs.com/package/tsx),
so this will ideally be installed globally on your machine.

```sh
npm install --global tsx
```

Alternatively, you can also change the config option `tsxCmd`
to commands like `npx tsx` or `pnpm dlx` to avoid global installation.

<details>
  <summary>Developer commentary: avoiding tsx?</summary>

To facilitate changing a JS/TS source code to TeX, we swap out the
HTML focused `mathlifier` library with the TeX focused `mathlifier2`.

I used this texGenerator approach to work around having to execute
the modified source code. A better solution might lie in virtual modules,
but I'm not familiar with that. PRs will be more than welcome on this issue.

</details>

### fs-extra

Currently, fs-extra is used to generate tex files for compilation. We will need
to install it as a dev dependency.

```sh
npm install --save-dev fs-extra
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
