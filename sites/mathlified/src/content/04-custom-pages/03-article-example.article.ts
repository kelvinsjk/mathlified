import { x } from 'mathlifier';

const coeffs = [];
for (let i = 0; i < 3; i++) {
	// random numbers between 2 and 11
	coeffs.push(Math.random() * 10 + 2);
}
const [a, b, c] = coeffs;
const numerator = `${a}x^2 + ${b}x + ${c}`;
const denominator = `\\ln x`;
const expression = `\\frac{${numerator}}{${denominator}}`;

export const djot = x`# Article Example

One pattern the author often employs is to generate djot within JavaScript,
and interpolate mathematical expressions via the \`\${var}\` template literal syntax.

We provide a demo via the \`article\` template here.

We hope this demo showcases how useful this approach can be. Pair it with a Computer
Algebra System (we are working on [mathlify](https://www.npmjs.com/package/mathlify))
for extra expressive power.

> The demo is best understood by comparing the source file
> in the content folder with the generated page

## Demo

We generate the random numbers ${a}, ${b}
and ${c}
in JavaScript to produce
$${expression}

The \`x\` function in Mathlifier allows for cross compatible
amsmath environments like the following:

#${'align'}
y &= ${expression}
\\\\ &= (${numerator})(${denominator})^{-1}

## Escaping backslashes

Backslashes \`\\\` often occur in $\\LaTeX$ but needs to be escaped
(with an additional backspace in front) when working with JavaScript
strings. 

## Introducing mathlifier

### Math interpolation

You can still use regular static math, like $x=1$.
These follow the regular typesetting rules (start and end with \`\$\` signs).

### Environments and cross platform compatibility

`;
