# The Mathlified.tex Template

The Mathlified.tex extension is the default extension provided
by the framework for working from LaTeX (as opposed to js/ts).

## Supported LaTeX features

Because of the attempt to convert LaTeX code into
web compatible markup, only the following LaTeX specific
features and commands are supported:

- Math within the $...$ delimiters
- Display math within the $$...$$ delimiters
- Latex comments with the % prefix (which will be stripped out)
- The following math environments:
  - equation, equation\*
  - gather, gather\*
  - align, align\*
  - alignat, alignat\*
- Paragraphing via two line breaks
- `\emph{...}` and `\textbf{...}`
- `\newline` and `\linebreak`

:::warning
Note that the `\\` syntax for creating new lines is not
supported at the moment
because it is context-sensitive (e.g. `\\` has a slightly different
meaning in the align environments when compared to regular text environment.)
:::

## Markdown-style sectioning

We are a big fan of the markdown `#`, `##` and `###` sectioning tags and have
used it to indicate sections (subsections and subsubsections) in our `**/*.mathlified.tex`
files rather than the usual `\section{...}` syntax.

## Mathlified.tex Example

```tex
% src/lib/mathlified/my-tex.mathlified.tex
# Section 1

Math like $x$ is supported, and so is
$$ 2x + 3y = 4. $$

## Subsection 1.1

We support \emph{emphasized} text and \textbf{bold} text.
\linebreak
Line breaks and \newline are supported as well.

The new paragraph syntax is supported too.

### Subsubsection 1.1.1

\begin{align}
	2x + 3y &= 4 \\
	3x - y &= 5
\end{align}
```
