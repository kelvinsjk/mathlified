# Customizing pdf (LaTeX) Output

## Relevant files

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD040 -->

```
.
└── src
│   ├── lib
│   │   ├── mathlified
│   │   |   ├── content-handlers
│   |   |   |   ├── post.ts
│   |   |   |   ├── qn.ts
│   |   |   |   └── qns.ts
│   │   │   ├── **/*.post.ts
│   │   │   ├── **/*.qn.ts
│   │   │   └── **/*.qns.ts
└── vite.config.ts
```

<!-- markdownlint-restore -->

On the first server start, the 3 default content handlers
will be created at `src/lib/mathlified/content-handlers`.

They will be the files in charge of turning the js/ts extensions
into LaTeX markup.

:::tip
The content handler files are not overwritten if they are already present.
This allows for your own customizations.

If you wish to revert back to the
defaults, delete the files and Mathlified will generate them on the next
server start.

Further customizations of the generated TeX file are done via the Plugin options
for `vite-plugin-sveltekit-tex`.
:::

## The content handler

Each extension must have a corresponding content handler. The file have two purposes

- Define the object structure type of the extension (if working in TypeScript)
- Handle the extension object to produce the relevant LaTeX markup

They must export a function named `contentHandler` which will take
in the extension object and return a string containing LaTeX markup.

### Default post content handler

For example, the default `post` content handler is as follows:

```ts
// src/lib/mathlified/content-handlers/post.ts
export interface Post {
	title?: string;
	body: string;
}

export function contentHandler(post: Post): string {
	return post.body;
}
```

## Customizing the content handler

Since the content handler files are not overwritten, we can then customize our output
by directly modifying the `src/lib/mathlified/content-handler/post.ts` file.

For example, we may want to put our post content in a box:

### Example customization

```ts
// src/lib/mathlified/content-handlers/post.ts
export interface Post {
	title?: string;
	body: string;
}

export function contentHandler(post: Post): string {
	return `\\fbox{${post.body}}`;
}
```

## Plugin options

The following are the plugin options that can be provided to
`vite-plugin-sveltekit-tex` to alter the LaTeX output.

```ts
interface MathlifiedOptions {
	// Command to use to generate pdf.
	latexCmd?: string; // default: 'xelatex'
	// LaTeX document class
	cls?: string; // default: 'article'
	// LaTeX document options
	docOptions?: string; // default: ''
	// content to be placed after the \documentclass command
	// and before the \begin{document} command
	preamble?: string; // default: '\\\\usepackage{amsmath}\n',
	// content to be place after \begin{document}
	// and before the output from the content handler
	preContent?: string; // default: ''
	// content to be place after the output from the content handler
	// and before the \end{document} command
	postContent?: string; // default: ''
}
```

## Advanced customizations

Advanced customization will involve changing the structure of the exported object. For
example, we may want to have a theorem in the post.

### Example of customizing object structure

```ts
// src/lib/mathlified/content-handlers/post.ts
export interface Post {
	title?: string;
	theorem: string;
	body: string;
}

export function contentHandler(post: Post): string {
	return (
		"\\begin{theorem}\n" +
		post.theorem +
		"\n\\end{theorem}\n" +
		post.body
	);
}
```

Note that for this to work, we will need to add the `\newtheorem{theorem}{Theorem}`
to the preamble under the plugin options. Also don't forget to modify the Svelte component
for the theorem to show up on the web!
