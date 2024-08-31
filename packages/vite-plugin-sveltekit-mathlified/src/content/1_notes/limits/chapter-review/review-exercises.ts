// ax^2 - bx + c
const x = 0;
const [a, b, c] = [3, -2, 4];
const answer = a * x ** 2 + b * x + c;
export const title = 'Review Exercises';

export const content = `
## More about Mathlified

In addition to Djot, Mathlified also supports content written in JavaScript 
(note: we only support the \`.ts\` Typescript extension at the moment).
To do this, we export a \`content\` string containing Markdown.

### Why author in JavaScript

Many a times authoring mathematical content means doing the necessary groundwork with other tools (eg calculators, other software
and good ol' pen and paper) first. We then proceed to translate some of the results into our content.

We have found producing content in a general purpose programming language very useful. For the example in this page, we no longer
to reach for an external calculator to get the answer. We have also found the templating syntax using backticks quite natural,
with \`$\{answer}\` used to pass the variable to the template.

### Things to be careful about

When working in JavaScript instead of Markdown, we need to be aware of the following considerations:

- The backslash, \`\\\`, which frequently occurs in $\\LaTeX$ needs to be escaped (via an extra backslash)

### Title and order

Similar to front matter in Markdown, we can also have custom title and order by having
the optional exports \`title\` and \`order\` (we currently only support string literals and numbers for these options).

\`\`\`js
export const title = "My Title";
\`\`\`

\`\`\`js
export const order = 1;
\`\`\`

---

## Question 214

Evaluate $\\displaystyle \\lim_{x \\to ${x}} ${a}x^2 ${b}x + ${c}$.

### Answer

$${answer}$.

---

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman,
under the [Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
`;
