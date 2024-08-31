import { mathlifierDj as md } from 'mathlifier';
import { Polynomial, quotient } from 'mathlify';

export const pdf = true;
const rootX = '\\sqrt{x}';
const exercises = [
  Polynomial.ofDegree(7).plus(10),
  new Polynomial([5, 0, -1, 1]),
  new Polynomial([4, -7]),
  new Polynomial([8, 0, 9, 0, -1]),
  Polynomial.ofDegree(4).plus(quotient(2, 'x'))
].reduce((prev, poly) => `${prev}1. $f(x)=${poly}$\n\n`, '');

export const content = md`
# Differentiation Rules

- 3.3.1 State the constant, constant multiple, and power rules.
- 3.3.2 Apply the sum and difference rules to combine derivatives.
- 3.3.3 Use the product rule for finding the derivative of a product of functions.
- 3.3.4 Use the quotient rule for finding the derivative of a quotient of functions.
- 3.3.5 Extend the power rule to functions with negative exponents.
- 3.3.6 Combine the differentiation rules to find the derivative of a polynomial or rational
  function.

## Learning Objectives

Finding derivatives of functions by using the definition of the derivative can be a lengthy and, for
certain functions, a rather challenging process. For example, previously we found that
${''}\\frac{d}{dx} (${rootX}) = \\frac{1}{2${rootX}}
by using a process that involved multiplying an expression by a conjugate prior to evaluating a
limit. The process that we could use to evaluate $\\frac{d}{dx} (\\sqrt[3]{x})$ using the
definition, while similar, is more complicated. In this section, we develop rules for finding
derivatives that allow us to bypass this process. We begin with the basics.

## The Basic Rules

The functions $f(x)=c$ and $g(x)=x^n$ where $n$ is a positive integer are the building blocks from
which all polynomials and rational functions are constructed. To find derivatives of polynomials and
rational functions efficiently without resorting to the limit definition of the derivative, we must
first develop formulas for differentiating these basic functions.

### The Constant Rule

We first apply the limit definition of the derivative to find the derivative of the constant
function, $f(x)=c$. For this function, both $f(x)=c$ and $f(x+h)=c$, so we obtain the following
result:

TODO: align

The rule for differentiating constant functions is called the **constant rule**. It states that the
derivative of a constant function is zero; that is, since a constant function is a horizontal line,
the slope, or the rate of change, of a constant function is $0$. We restate this rule in the following theorem.

### Theorem 3.2

#### The Constant Rule

Let $c$ be a constant.

If $f(x)=c$, then $f'(x)=0$.

Alternatively, we may express this rule as

$${''}\\frac{d}{dx} (c) = 0.



## Section 3.3 Exercises

For the following exercises, find ${"f'(x)"}
for each function.

### Questions 106-110

@${exercises}

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman, under the
[Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
`;
