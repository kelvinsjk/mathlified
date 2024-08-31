---
pdf: true
---

# Introduction

## More about Mathlified

### Ordering of pages and directories

Pages and directories are ordered according to depth and then alphabetical order. Notice how the
`1-review...` comes before `2-basic...` in the previous section.

However, what if we want this page (titled `introduction`) to appear before `1-a-preview...`?

### Using underscores in file names

Notice how this file is named `0_introduction`, but the webpage is at `/notes/limits/introduction`.

> Mathlified ignores the part of the file name before the first `_` underscore and uses the rest as
> the name

This allows us to use the first part of the filename to order our pages and directories (the same
rule applies for directories). As an added bonus, most file explorers will sort files in the same
order.

If you do indeed want this page to be `0_introduction`, we can name it `0x0_0_introduction`.

### Hidden files in the content folder

Look for the file `1_notes/_hidden.md`.

> Files and directories with a leading underscore will be ignored by Mathlified.

### New Markdown notation

In this page, we use the following features:

- Blockquotes are produced using `>`

### Amsmath Environments

In LaTeX, the `amsmath` environments (e.g. `align` and `gather`) are called outside math/display
mode.

We use [temml](https://temml.org) to create these environments in HTML and these are only available
in display mode.

---

## Introduction to limits

> Science fiction writers often imagine spaceships that can travel to far-off planets in distant
> galaxies. However, back in 1905, Albert Einstein showed that a limit exists to how fast any object
> can travel.

The problem is that the faster an object moves, the more mass it attains (in the form of energy),
according to the equation

$$
\begin{align*} m &= \frac{m_0}{\sqrt{1 - \frac{v^2}{c^2}}}, \\ \frac{m}{m_0} &= \frac{1}{\left(
1 - \left( \frac{v}{c} \right)^2 \right)^{\frac{1}{2}}} \end{align*}
$$

where $m_0$ is the object’s mass at rest, $v$ is its speed, and $c$ is the speed of light. What is
this speed limit?

---

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman, under the
[Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
