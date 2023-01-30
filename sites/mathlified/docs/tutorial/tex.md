# Working from TeX

There are times where we want to work in LaTeX rather than js/ts.
By default, Mathlified will look for files of the form `src/lib/mathlified/**/*.mathlified.tex`
and attempt to convert it to readable html markup augmented by the `mathlifier` library.

## Features

The default parser provided by Mathlified will look for the following
LaTeX markup and parse them to HTML:

- Inline math with the `$...$` syntax
- Displayed math with the `$$...$$` syntax
- The following environments supported by KaTeX

  - equation, equation\*
  - gather, gather\*
  - align, align\*
  - alignat, alignat\*

- Bold text via `\textbf{}`
- Emphasized text via `\emph{}`
- New paragraphs via empty lines (note that this may not work presently in Windows)
- `\newline` and `linebreak` will both be converted to `<br>`

Note that the `\\` new line syntax is **_not_** presently supported due to the different meanings
in different contexts (e.g. in align environments).

## Markdown-based Sectioning

We love the quick sectioning provided by the "#" markdown
syntax and have implemented this in parsing `**/*.mathlified.tex` files.

## Example

```tex
% src/lib/tex-example.mathlified.tex
# Section

We support inline math $x$ and displayed math
$$ ax^2 + bx + c = 0 $$

## Subsection

New paragraphs, \linebreak
and \newline
are also implement, along with
\textbf{bold} and \emph{emphasized} text.

### Subsubsection

We support the equation, gather, align
and alignat (along with the \* counterparts)
environments.

\begin{align}
	2x + 3y &= 5 \\
	3x - 2y &= 1
\end{align}
```
