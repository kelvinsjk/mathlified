# Basics

## Start up the dev server

First start up the dev server.

```sh
npm run dev
```

On startup, the Mathlified plugin will generate
three svelte components in the
`src/lib/mathlified/components`
folder and three content handler ts functions/files
in `src/lib/mathlified/content-handler`.

These will be the files handling our output on the sveltekit site
and pdfs respectively. If these files are already present, Mathlified will not overwrite them. This behavior facilitates customization.

If things are breaking and you want the original
defaults, just delete these files/folders and Mathlified will re-generate them
on the next server start up.

## The mathlified folder

The main folder that will be monitored will be the `src/lib/mathlified` folder.
Place all your relevant source files here for Mathlified to do its magic.

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD040 -->

```
.
└── src
    ├── lib
		│   ├── mathlified
		│   |   ├── components
		|   |   ├── content-handlers
		│   │   ├── **/*.post.ts
		│   │   ├── **/*.qn.ts
		│   │   ├── **/*.qns.ts
		│   │   └── **/*.mathlified.tex
		├── routes
		└── output
				├── tex
				├── pdf
				└── snippets
```

<!-- markdownlint-restore -->

:::tip
Place all relevant source files in `src/lib/mathlified`.
:::

## Naming convention

By default, Mathlified ships with three default js/ts extensions: "post", "qn" and "qns",
and one default tex extension "mathlified". We will look for files in the `src/lib/mathlified/`
folder ending with a `**/*.post.ts`, `**/*.qn.ts`, `**/*.qns.ts` (or js) and `**/*.mathlified.tex` extensions.

::: tip
Only files with the correct extensions will generate the SvelteKit page and pdf file.

All other files will not, meaning that you can colocate other files containing templates and
helper functions without worry.
:::

:::info
The default extensions are

- `**/*.post.ts` (or js)
- `**/*.qn.ts` (or js)
- `**/*.qns.ts` (or js)
- `**/*.mathlified.tex`

:::

::: warning
Avoid naming clashes. `my-post.post.ts`, `my-post.qn.ts` and `my-post.mathlified.tex` will
all try to generate SvelteKit routes and pdf files at the same location.
:::

### Nesting

The nesting level will also be reflected. For example, `src/lib/mathlified/my-post.post.ts`
will generate a page at `my-domain.com/my-post` while `src/lib/mathlified/folder/nested-post.post.ts` will generate a page at `my-domain.com/folder/nested-post`.

## Working from LaTeX

Create a file `src/lib/mathlified/tex-example.mathlified.tex`.

```tex
% src/lib/mathlified/tex-example.mathlified.tex
This is an example source file in LaTeX.

Save this file while the dev server is running and
we will have a SvelteKit route at http://localhost:5173/tex-example
and the generated pdf at src/output/pdf/tex-example.pdf
```

## Working from JS/TS

Create a file `src/lib/mathlified/my-post.post.ts`.

### Export convention

A `**/*.post.ts` (or js) file will need to export an object named `post`. For example,

```js
// src/lib/mathlified/my-post.post.ts
export const post = {
	title: "My Title",
	body: "My post content",
};
```

::: tip
`**/*.post.ts` files needs to export an object named `post`.

`**/*.qn.ts` files will export an object named `qn` and so on...
:::

By default, `post.body` will be where the post content will go with
an optional `post.title` for the post title.

Each extension will have its own convention about the object structure.
Look at the default extensions section for more details.

::: info
Mathlified is designed to be easily customizable to suit your needs.
Create your own extension with its own structure when you are ready.
:::

### Dependency tracking

One really useful feature of Mathlified is that it tracks the dependencies
of the extension files.

For example, say `my-post.post.ts` and `my-qn.qn.ts` both import a
`helperFn` from `helper.ts`. Changing the contents of
`helper.ts` will trigger Mathlified to regenerate the output pdfs
(SvelteKit and Vite also automatically updates the SvelteKit routes(s)).

This works for nested dependencies as well!

## Hot module reloading

Most of the magic of Mathlified happens during hot module reloading (HMR).

### SvelteKit route

Upon saving your `my-post.post.ts` file, HMR will
be triggered. Mathlified will generate the appropriate files
and you can now navigate to `http://localhost:5173/my-post`
to see the generated SvelteKit page.

### Output tex and pdf

The output tex and pdfs will
be generated at `output/tex/**/*` and `output/pdf/**/*`.
Look out for the console messages that will be emitted when these files are
created.
