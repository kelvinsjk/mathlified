---
pdf: true
tex: true
pdfEngine: lualatex
documentclass: book
fontsize: 11pt
papersize: a3
classoption: draft, twocolumn
includeInHeader: src/lib/pdf/fancyhdr.tex
includeBeforeBody: \fancyhead[C]{Mathlified}
includeAfterBody: src/lib/pdf/footer.tex
---

# Pdf options

## App-wide options

Use the `options` object for app-wide pdf options in
`vite-plugin-sveltekit-mathlified`, which you can add in
`vite.config.ts` in the project root. The type signature is:

```ts
interface Options {
  pdf?: PdfOptions
}

interface PdfOptions {
  // whether to generate a .tex file first
  tex?: boolean;
  engine?:
    | 'pdflatex'
    | 'xelatex'
    | 'lualatex'
    | 'tectonic'
    | 'latexmk';
  documentclass?: string;
  fontsize?: string;
  papersize?: string;
  classoption?: string;
  includeInHeader?: string;
  includeBeforeBody?: string;
  includeAfterBody?: string;
}
```

## File-specific options

We can override app-wide options for specific files by adding the relevant option to the front matter, like we did in this file.

## Note about include files

The options `includeInHeader`, `includeBeforeBody`, and `includeAfterBody` can either be a file path to a TeX file or a string.

Note that the file path should be **relative to the root** of  the project, not from this current file within the content folder.

Mathlified will check if the string provided is a valid file path. If not, it will be treated as a TeX string to be included in the document.

## Exercise

Play around with both app-wide and file-specific pdf options.
