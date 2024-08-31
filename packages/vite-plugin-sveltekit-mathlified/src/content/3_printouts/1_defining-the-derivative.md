---
pdf: true
---

# Defining the derivative

## Getting pdfs with Mathlified

For md files, we set up front matter like follows:

```md
---
pdf: true
---
```

Make sure your dev server is running (with `pnpm run dev` or `npm run dev`) and save this current md
file. Mathlified will convert this to a pdf to be found in the `mathlified` folder at the project
root, with a success/failure message printed on the terminal.

## Learning objectives

- 3.1.1 Recognize the meaning of the tangent to a curve at a point.
- 3.1.2 Calculate the slope of a tangent line.
- 3.1.3 Identify the derivative as the limit of a difference quotient.
- 3.1.4 Calculate the derivative of a given function at a point.
- 3.1.5 Describe the velocity as a rate of change.
- 3.1.6 Explain the difference between average velocity and instantaneous velocity.
- 3.1.7 Estimate the derivative from a table of values.

Now that we have both a conceptual understanding of a limit and the practical ability to compute
limits, we have established the foundation for our study of calculus, the branch of mathematics in
which we compute derivatives and integrals. Most mathematicians and historians agree that calculus
was developed independently by the Englishman Isaac Newton (1643–1727) and the German Gottfried
Leibniz (1646–1716), whose images appear in Figure 3.2. When we credit Newton and Leibniz with
developing calculus, we are really referring to the fact that Newton and Leibniz were the first to
understand the relationship between the derivative and the integral. Both mathematicians benefited
from the work of predecessors, such as Barrow, Fermat, and Cavalieri. The initial relationship
between the two mathematicians appears to have been amicable; however, in later years a bitter
controversy erupted over whose work took precedence. Although it seems likely that Newton did,
indeed, arrive at the ideas behind calculus first, we are indebted to Leibniz for the notation that
we commonly use today.

TODO: image

## Tangent lines

We begin our study of calculus by revisiting the notion of secant lines and tangent lines. Recall
that we used the slope of a secant line to a function at a point $(a,f(a))$ to estimate the rate of
change, or the rate at which one variable changes in relation to another variable. We can obtain the
slope of the secant by choosing a value of $x$ near a and drawing a line through the points
$(a,f(a))$ and $(x,f(x))$, as shown in Figure 3.3. The slope of this line is given by an equation in
the form of a difference quotient:

$$ m\_{\text{sec}} = \frac{f(x)-f(a)}{x-a}. $$

We can also calculate the slope of a secant line to a function at a value $a$ by using this equation
and replacing $x$ with $a+h$, where $h$ is a value close to $0$. We can then calculate the slope of
the line through the points $(a,f(a))$ and $(a+h,f(a+h))$. In this case, we find the secant line has
a slope given by the following difference quotient with increment $h$:

$$ m\_{\text{sec}} = \frac{f(a+h)-f(a)}{a+h-a} = \frac{f(a+h)-f(a)}{h}. $$

### Definition

Let $f$ be a function defined on an interval $I$ containing $a$. If $x\neq a$ is in $I$, then

TODO: equation

$$ Q = \frac{f(x)-f(x)}{x-a} $$

is a **difference quotient**.

Also, if $h \neq 0$ is chosen so that $a+h$ is in $I$, then

$$ Q = \frac{f(a+h)-f(a)}{h} $$

is a difference quotient with increment $h$.

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman, under the
[Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
