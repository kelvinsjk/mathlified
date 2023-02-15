# Custom JS/TS Extensions

As seen in the previous sections, the output from a js/ts extension
can be modified via:

- The Svelte Component (e.g. `components/Post.svelte`) for web output
- The content handler (e.g. `content-handlers/post.ts`) for LaTeX content
- LaTeX options in the plugin config for LaTeX markup around the content

Creating a custom JS/TS extension thus involves these three steps.

## Step 1: Define the extension

This is done by the `exts` plugin option, which is an object with the
new extension name as the key and LaTeX options as the prop.

### Example plugin config

```ts
// vite.config.ts (or js)
import { sveltekit } from "@sveltejs/kit/vite";
import { mathlified } from "vite-plugin-sveltekit-tex";
export default {
	plugins: [
    sveltekit(),
    mathlified({
      exts: {
        "new-extension": {},
        report: {
          latexOptions: {
            latexCmd: "pdflatex";
	          cls: "report";
	          docOptions: "12pt";
	          preamble: "\\usepackage{biblatex}";
	          preContent: "\\maketitle";
	          postContent: "\\printbibliography"
          }
        }
      }
    })
  ],
};
```

The above example now adds two extensions. Mathlified will now
attempt to create SvelteKit routes and tex/pdf files when it encounters
`**/*.new-extension.js` and `**/*.report.js` (or ts equivalent).

`new-extension` did not have any custom LaTeX options so it will inherit them from
the plugin options and/or the defaults. Each of the 5 LaTeX options are optional
and will also inherit if omitted.

## Step 2: Create content handler

For the `report` extension example, create the content handler
at `src/lib/mathlified/content-handlers/report.ts` (or js). It will include
the type structure of the `Report` object (optional) and export a function
`contentHandler(x: Report): string` to generate the LaTeX markup from it.

## Step 3: Create Svelte component

For the `report` extension example, create the Svelte component
at `src/lib/mathlified/components/Report.svelte` which will take in
a prop `report`.

## Start creating new content

We can now create files of the type `src/lib/mathlified/**/*.report.ts`
and Mathlified will do its work.
