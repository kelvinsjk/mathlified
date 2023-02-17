# Introduction

## What is Mathlified?

Mathlified is a framework that aims to provide a
"write once, run anywhere" experience for producing
mathematical content.

### Print vs web

Digitizing mathematical writing is already a non-trivial
pursuit. Increasingly we also have to decide
which medium to work in/optimize for: print or the web.
Trying to do both is a chore,
and often with less than stellar resulting
output too!

Mathlified is the culmination of my efforts to produce
beautiful content for both mediums.

Write content in JavaScript/TypeScript or LaTeX,
and get a website (powered by SvelteKit) as well as
generated tex and pdf files.

Mathlified is built on top of existing technologies
including [SvelteKit](https://kit.svelte.dev/), [Vite](https://vitejs.dev/),
[KaTeX](https://katex.org/) (via [mathlifier](https://www.npmjs.com/package/mathlifier))
and [LaTeX](https://www.latex-project.org/), and tied together by [vite-plugin-sveltekit-tex](https://www.npmjs.com/package/vite-plugin-sveltekit-tex).

## Why Mathlified?

I teach Mathematics, and I cringe whenever I see my students
working with pdfs ill-suited for their mobile phones. It's fine in a pinch,
but surely we can do better.

I still want LaTeX generated pdfs for printouts, but have grown to believe
the future is in web technologies. Mathlified is an attempt to unify the two worlds.

## Working in JavaScript/TypeScript

I've actually grown to like creating my content in Javascript/TypeScript
over the years, and would urge you to give that a go if you haven't already. The main annoyance is the need to escape backslashes (so `'\\quad'` vs `\quad`), but it also unlocks features like:

### The power of JS

Working in JavaScript/TypeScript means having the full power of the language at your disposal. In the past, when working in LaTeX, I've often had to work out calculations either mentally or on scratch paper before typing out the results. This often makes maintenance tough as a mistake
could be due to a typo or a calculation error, which could appear at any line.

Working those out in the language before [interpolating the results](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) has become one of my favorite tools.

We can even get fancy and use it to [generate random values for questions](https://math-pro.vercel.app/questions/12/1201a)!

(An aside: In another world maybe I would learn how to do some of the above in [LuaTeX?](https://www.luatex.org/))

### Intellisense and linting

The intellisense and linting features in JS/TS is much more robust and fully-featured compared
to LaTeX.

### Lightning fast HMR

The [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
VS Code extension has made compiling LaTeX so much easier, but the lightning fast hot module reloading powered by Vite gives a much better developer experience for me with the shorter feedback cycle. Getting KaTeX to not throw on error has also made it easier for me to catch syntax errors more effectively as opposed to compilation errors in LaTeX.

## Working in LaTeX

For more static content we may still prefer to work in LaTeX. [Inspired by how AryaDee's python script](https://www.reddit.com/r/sveltejs/comments/1078jsx/using_latex_math_in_sveltekit_mdsvex/), Mathlified also supports converting
tex markup to Svelte component. In fact, this approach even allows for
custom syntax by writing appropriate transformation functions. (e.g. Mathlified uses the markdown `#` syntax for sectioning within our `mathlified.tex` files)
