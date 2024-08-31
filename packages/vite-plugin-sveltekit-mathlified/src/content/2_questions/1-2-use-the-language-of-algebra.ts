export const title = 'Use the language of algebra';
export const pdf = true;

import { mathlifierDj as markdown } from 'mathlifier';
import { Polynomial } from 'mathlify';

const mathlifierWriteup = `
## Programmatic generation of content

Working with JavaScript presents limitless potential in how we author content. For example,
if we are trying to introduce the concept of a linear polynomial $ax+b$,
we can use JavaScript to generate many example $a$ and $b$s and run a loop to generate the examples.
We then convert these to the output via JavaScript templating: \`&dollar;{a}x+&dollar;{b}\`.

This seems pretty straightforward, and works most of the time, until we realize our mathematical conventions:
the result should look different depending on whether our variables are positive, negative or zero 
(if one or both are zero are handled differently too) and if \`a\` is one or negative one.

We started off writing functions to handle that, and before we knew it we built Mathlify, a
computer algebra system (CAS) with an emphasis on presentation.

> Evidently this author isn't very good at naming his projects

## Introducing Mathlify

To generate the example on this page, we import the \`Polynomial\` class from Mathlify.
Each class in Mathlify comes with a \`toString\` method that outputs its LaTeX string representation,
allow for easy interpolation into text, especially with the Mathlifier library.

\`\`\`js
import { Polynomial } from 'mathlify';

const poly1a = new Polynomial([9, 0]); // 9x
const poly1b = new Polynomial([3, 8]); // 3x + 8
const ans = poly1a.plus(poly1b); // 12x + 8
\`\`\`


---

`;

const poly1a = new Polynomial([9, 0]);
const poly1b = new Polynomial([3, 8]);
const poly2a = new Polynomial([8, 7]);
const poly2b = new Polynomial([4, -5]);

const demoWriteup = markdown`
## Review exercises

### Questions 981, 984

1. Simplify ${poly1a} + ${poly1b}.
3. Simplify ${poly2a} + ${poly2b}.

### Answers

- ${poly1a.plus(poly1b)}.
- ${poly2a.plus(poly2b)}.

---

## Copyright and license information

Adapted from OpenStax Elementary Algebra 2e by
Lynn Marecek, MaryAnne Anthony-Smith, Andrea Honeycutt Mathis
under the [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).
Access for free at <https://openstax.org/books/elementary-algebra-2e/pages/1-introduction>.
`;

export const content = mathlifierWriteup + demoWriteup;
