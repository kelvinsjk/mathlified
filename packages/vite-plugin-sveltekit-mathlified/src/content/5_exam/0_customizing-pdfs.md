# Customizing pdfs

In the [printouts](/printouts/local-setup) section, we created pdfs from our `md` and `ts` files. In
the [quiz](/quiz/sitewide-customization) section, we modified how our `ts` files are structured to
author customized content.

If we were to try add pdf functionality to the pages in the quiz section, we will find that pdfs
cannot be generated for the `ts` files. This is because Mathlified no longer understand the
structure of our custom `ts` files.

We can fix this on a page-by-page basis by also exporting `content` from our `ts` files. However, we
will often like to handle all files in the same content collection the same way, and we can do that
in Mathlified.

## toTex function

In the previous section, we exported a `preprocess` function in `src/lib/server/quiz.ts`. This file
can also export a `toTex` function to tell Mathlified how to convert the `ts` files in the content
collection folder to LaTeX markup.

For this section, we are creating a new `exam` content collection type. You can look at the
`Exam.svelte` component and the `preprocess` function in `src/lib/server/exam.ts` to see how we used
the same concepts from the previous quiz section to produce a sample exam. In the `exam.ts` file, we
also export a `toTex` function to support pdf generation.

This function takes in as its argument the `module` (ie the `exam/xxx.ts` file from our content
folder) and returns an object of the following type signature:

```ts
interface ToTexOutput {
  documentclass: string;
  classoption: string | string[];
  'header-includes': string;
  content: string;
}
```

The `documentclass` and `classoption` should be self-explanatory. The `header-includes` will be
included after that, and the `content` will be placed in between the `\begin{document}` and
`\end{document}` tags.

Mathlified will use this function to generate the tex file, and compiles it to pdf for you when it
detect changes in the `ts` files when the dev server is running.
