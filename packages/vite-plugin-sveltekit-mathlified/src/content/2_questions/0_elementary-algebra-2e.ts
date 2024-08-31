import { mathlifierDj } from 'mathlifier';
const mathlifierWriteup = `# Elementary Algebra 2e

## The problem with $

> Is $ the root of all evil?

In the previous page we looked at we used the JavaScript templating syntax to mix dynamic content with text.
When math notation is involved, we enclose the LaTeX markup with \`$\` of \`&dollar;&dollar;\`.

Unfortunately, JavaScript also uses the \`&dollar;{}\` to interpolate values. This sometimes
lead to code that is hard to read and debug. We often end up with mismatched number of \`$\`s, leading to crashes
and/or unexpected output.

> This is the only time in life I get to say I have too much $

## Introducing Mathlifier

We wrote the Mathlifier library to make this situation better. It only affect \`$\{}\` syntax so
all other Djot markup is left untouched. Notice how the \`demoWriteup\` variable in this file
has its backticks preceded by the imported \`mathlifierDj\` function (to convert markup into Djot).

### Math mode

As a mathematics-focused library, the default behavior when interpolating with \`$\{}\` is to treat the interpolated
value as LaTeX markup. To facilitate mixing dynamic and static content, subsequent content are treated as part of the
same inline math block. We automatically terminate the inline math block when a line break is encountered.

> Start (inline) math mode with \`$\{}\`. Math mode only ends with a line break

For example, if we have defined a variable \`k=2\` in JavaScript, then

\`\`\`
diameter is $\{k}r
for a circle
\`\`\` 

produces "diameter is &dollar;2r&dollar; for a circle"

### Display mode

Display mode is triggered by \`&dollar;&dollar;{}\`. As display math often contains more content, we do not terminate on line break.
Instead, displayed mode is only terminated by an empty line.

\`\`\`
The equation 
&dollar;&dollar;{k}x + 1
= $\{k}

is a linear equation
\`\`\` 

produces "The equation &dollar;&dollar;2x + 1 =2&dollar;&dollar; is a linear equation".

### Math environments

Mathlifier also makes math environments easier to use by automatically closing them. For example,

\`\`\`
The equations

&dollar;&dollar;{'align*'}
x + y &= 1 \\\\\\\\
x - y &= $\{k}

can be solved simultaneously
\`\`\` 

produces 

\`\`\`latex
The equations 

&dollar;&dollar;\\begin{align*}
x + y &= 1 \\\\\\\\
x - y &= 2
\\end{align*}&dollar;&dollar;

can be solved simultaneously
\`\`\`

### Text mode

To interpolate text, we use the \`@\` character to prevent the math mode behavior. For example, if we the variable
\`shape="circle"\` in JavaScript, then

\`\`\`
A @$\{shape} has 
radius $\{k}r
\`\`\`

will produce "A circle has radius &dollar;2r&dollar;".

---

`;
const [a, b, c, d] = [5, 3, -2, 7];
const [color1, color2] = ['blue', 'red'];

const demoWriteup = mathlifierDj`## Add integers

Most students are comfortable with the addition and subtraction facts
for positive numbers. But doing addition or subtraction with both positive and negative numbers may be more challenging.

We will use two color counters to model addition and subtraction of negatives so that you can visualize the procedures
instead of memorizing the rules.

We let one color (@${color1}) represent the positive counter and the other color (@${color2}) represent positive.
The other color (@${color2}) will represent the negatives. If we have one positive counter and one negative counter,
the value of the pair is zero. They form a neutral pair. The value of this neutral pair is zero.

We will use the counters to show how to add
the four addition facts using the numbers ${a}, -${a}
and ${b}, -${b}.

$${a} + ${b}
\\quad -${a} + (-${b})
\\quad -${a} + ${b}
\\quad ${a} + (-${b})

To add ${a}+${b},
we realize that ${a}+${b}
means the sums of ${a}
and ${b}.

### Example 1.40

Simplify: ${-a}+${b}(${c}+${d}).

#### Solution

$${'align*'}
& -${a} + ${b}(${c}+${d})
\\\\ &= -${a} + ${b}(${c + d})
\\\\ &= -${a} + ${b * (c + d)}
\\\\ &= ${-a + b * (c + d)}

---

## Copyright and license information

Adapted from OpenStax Elementary Algebra 2e by
Lynn Marecek, MaryAnne Anthony-Smith, Andrea Honeycutt Mathis
under the [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).
Access for free at <https://openstax.org/books/elementary-algebra-2e/pages/1-introduction>.
`;

export const content = mathlifierWriteup + demoWriteup;
