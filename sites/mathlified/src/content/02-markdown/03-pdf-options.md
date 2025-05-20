---
pdf: true
pdfEngine: lualatex
documentclass: beamer
fontsize: 12pt
papersize: a4
classoption:
- b
- utf8x
includeInHeader: src/lib/pdf/fancyhdr.tex
includeBeforeBody: \fancyhead{Hello}
includeAfterBody: src/lib/pdf/footer.tex
---

# Pdf options

## App-wide options

Use the `options` object for app-wide pdf options in
`vite-plugin-sveltekit-mathlified`, which you can add in
`vite.config.ts` in the project root. The type signature is:

```ts
interface Options {
  pdf?: {
    engine?:
      | 'pdflatex'
      | 'xelatex'
      | 'lualatex'
      | 'tectonic'
      | 'latexmk';
    documentClass?: string;
    fontSize?: string;
    paperSize?: string;
    classOption?: string;
    includeIn?: {
      header?: string;
      beforeBody?: string;
      afterBody?: string;
    };
  };
}
```
