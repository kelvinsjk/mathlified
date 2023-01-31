# Formatting and typesetting

Html and LaTeX have their own approach and language for typesetting.
We will use the `mathlifier` library to facilitate interoperability
between the two.

::: tip
Use `mathlifier` to handle any typesetting.
:::

`mathlifier` will emit html but the Mathlified plugin
will swap it out for `mathlifier2` that emits LaTeX when appropriate.

## Example

The following examples showcase the common formatting features implemented
in `mathlifier`.

```js
// src/lib/mathlified/my-post.post.ts
import {
	strong,
	emph,
	newline,
	newParagraph,
} from "mathlifier";
export const post = {
	title: "Typesetting example",
	body: `This example showcases some common formatting.
		${newline}
		This will now appear on a new line.
		We can also have ${strong("bold")}
		and ${emph("italicized")} text.
		${newParagraph}
		This will now appear in a new paragraph. Using these functions
		ensure consistency between the output on the web and
		the LaTeX generated pdf.
	`,
};
```

## Custom HTML/LaTeX

For custom HTML and/or LaTeX, the `htmlTex`, `html` and `tex`
functions in `mathlifier` can be used.

```js
// src/lib/mathlified/my-post.post.ts
import { htmlTex, html, tex } from "mathlifier";
export const post = {
	title: 'Custom HTML/LaTeX'
	body: `If we want a list, we could implement it via
		${htmlTex(
			"<ul><li>My list item</li></ul>",
			"\\begin{itemize}\\item My list item\\end{itemize}"
		)}
		For something that only shows up on the web, we could use
		${html("<iframe>My iframe</iframe>")}

		For something that only shows up on the LaTeX document, we could use
		${tex("\\begin{tikzpicture}my tikz code\\end{tikzpicture}")}
	`,
};
```

Note the escaping of the backslashes for the LaTeX markup. Also don't forget
to add imports like `\usepackage{tikz}` in the `preDoc` options that can
be fed into the Mathlified plugin.

For common use-cases (I'm thinking images, lists and links off the top of my head),
I'm be more than happy to receive PRs to the `mathlifier` and `mathlifier2`
libraries!
