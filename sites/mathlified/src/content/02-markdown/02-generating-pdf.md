---
pdf: true
title: Pdf generation
---

The solution to $$ ax^2 + bx + c = 0 $$ is $ x = \frac{-b \pm
\sqrt{b^2 - 4ac}}{2a} $.

## Front matter

Take a look at the source code for this page
(`src/content/02-markdown/02-generating-pdf.md`) and see the starting
block being fenced by `---` dashes. This is the front matter commonly
used in many Markdown-based applications.

The `pdf` field is set to `true` in this case, which instructs
Mathlified to generate a PDF into the `output` directory of the
project root.

## Prerequisite

To make use of this feature, LaTeX, `djot` and `pandoc` will need to
be installed locally on your machine.

## Triggering PDF generation

PDF generation is triggered while in `dev` mode and on file change.

To see it in action, make sure your dev server is running (with
`pnpm run dev` or equivalent). Make some changes to this file. Upon
saving, you should see a success/failure message printed on the
terminal. Give it a try!

> The pdf generation feature of Mathlified only runs on file changes
> during `dev` mode.

## Exercise

Explore creating more pdfs, either by creating a new file or by adding
frontmatter to some of the earlier files. Do take note of the caveats
mentioned below though.

---

## Pdf generation caveats

### Amsmath environment

As discussed in the previous section, there is a difference in how
these environments are handled in LaTeX vs on the web. Hence, the use
of these environments is **not supported** when working in Markdown to
generate pdfs.

We will later show how to work around this issue using
[custom extensions](/custom-pages/article).

### The `\LaTeX` command

Similarly, the `\LaTeX` command is invoked within math mode on the web
but outside of it in LaTeX and is thus not supported for
cross-platform compatibility.

---

## More about Mathlified: page titles

By default, Mathlified uses the file name to generate the page title.
You can see this behavior for all previous files/pages in this
tutorial.

To override this behavior, we can set the `title` field in the front
matter, like we did in this file/page.
