---
pdf: true
---

# Generating PDFs

## Front matter

Take a look at the source code for this page (`src/content/02-markdown/02-generating-pdf.md`)
and see the starting block being fenced by `---` dashes. This is the front matter commonly used
in many Markdown-based applications.

The `pdf` field is set to `true` in this case, which instructs Mathlified to generate a PDF
into the `output` directory of the project root.

## Prerequisite

To make use of this feature, $\LaTeX$, `djot` and `pandoc` will need to be installed locally on your machine.

## Triggering PDF generation

PDF generation is triggered while in `dev` mode and on file change.

To see it in action, make sure your dev server is running (with `pnpm run dev` or equivalent). Make some changes to this file. Upon saving, you should see a success/failure message printed on the terminal. Give it a try!

> The pdf generation feature of Mathlified only runs on file changes during `dev` mode.
