# Content to page

As seen in the previous section, each Markdown file in the
`src/content` folder corresponds to a page. To create a new page,
create a Markdown file (with the `.md` extension) in the appropriate
folder.

## Math notation

Write math notation with $\LaTeX$ and surround them with `$` signs.
For example, the inline $x$ is generated using `$x$`.

Meanwhile, the displayed $$ax^2 + bx + c = 0$$ is generated using
`$$ax^2 + bx + c = 0$$`.

### Amsmath environment caveats

Environments like `align` is a potential banana peel. In $\LaTeX$,
they exist outside of math mode, so you will directly have
`\begin{...}` in your code. On the web, however, they have to be
inside a math displayed environment.

$$
\begin{align}
ax + by &= c\\
dx + ey &= f
\end{align}
$$

## Exercise

Create a `01a-next.md` file in the `src/content/02-markdown` folder to
have it show up as the next page in line in this tutorial. As a bonus,
try to use the following Markdown syntax in that file:

- Headings of levels 1, 2, and 3 using the `#`, `##`, and `###` syntax
- _Emphasis_ using the `_emphasis_` syntax
- Paragraphs by leaving an empty line between paragraphs
- Blockquotes with the `> blockquote` syntax
- Lists with the `- item` syntax
- Links with the `[text](url)` syntax
- Math notation discussed above

> Can you spot the use of these syntax on this very file/page?

Don't forget to have your `dev` server running so you can see the
changes reflected in real time.

## Learn Markdown

If you're new to Markdown, [CommonMark](https://commonmark.org/) has a
60 second tutorial to get you up to speed in no time.

## Learn LaTeX

If you're new to $\LaTeX$, we think the
[LaTeX Math for Undergrads pdf cheatsheet](https://tug.ctan.org/info/undergradmath/undergradmath.pdf)
is a good reference.
