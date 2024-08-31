---
title: 1.1 Review of functions
---

## More about Mathlified

### Page title

Sometimes we want a page title that is different from our file name. For this purpose, we use "front
matter", the part at the top of this file fenced by `---`. Upon receiving the "title" property,
Mathlified will use it instead of the default file name.

### New Markdown notation

In this page, we use the following features:

- Numbered lists (as opposed to unordered lists in the previous section) are produced by using `1.`,
  `2.`, etc.
- Italic text is produced using `_text_`.
- Bold text is produced using `**text**`.

### Mathematical notation

We also see our first mathematical notation!

- Inline math is produced by wrapping $\LaTeX$ markup in `$` signs.
- Display math is produced by wrapping $\LaTeX$ markup in `&dollar;&dollar;` signs.

---

## Learning objectives

1. Use functional notation to evaluate a function.
2. Determine the domain and range of a function.
3. Draw the graph of a function.
4. Find the zeros of a function.
5. Recognize a function from a table of values.
6. Make new functions from two or more given functions.
7. Describe the symmetry properties of a function.

## Functions

Given two sets $A$ and $B$, a set with elements that are ordered pairs $(x,y)$, where $x$ is an
element of $A$ and $y$ is an element of $B$, is a relation from $A$ to $B$. A relation from $A$ to
$B$ defines a relationship between those two sets. A function is a special type of relation in which
each element of the first set is related to exactly one element of the second set. The element of
the first set is called the _input_; the element of the second set is called the _output_. Functions
are used all the time in mathematics to describe relationships between two sets. For any function,
when we know the input, the output is determined, so we say that the output is a function of the
input. For example, the area of a square is determined by its side length, so we say that the area
(the output) is a function of its side length (the input). The velocity of a ball thrown in the air
can be described as a function of the amount of time the ball is in the air. The cost of mailing a
package is a function of the weight of the package. Since functions have so many uses, it is
important to have precise definitions and terminology to study them.

### Definition

A **function** $f$ consists of a set of inputs, a set of outputs, and a rule for assigning each
input to exactly one output. The set of inputs is called the **domain** of the function. The set of
outputs is called the **range** of the function.

## Piecewise-defined functions

Some functions are defined using different equations for different parts of their domain. These
types of functions are known as _piecewise-defined_ functions. For example, suppose we want to
define a function $f$ with a domain that is the set of all real numbers such that $f(x)=3x+1$ for
$x \geq 2$ and $f(x)=x^2$ for $x<2$. We denote this function by writing

$$ f(x) = \begin{cases} 3x+1 & x \geq 2 \\ x^2 & x<2 \end{cases}. $$

---

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman, under the
[Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
