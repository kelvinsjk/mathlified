export const title = 'Solving linear equations';

import { mathlifierDj as md } from 'mathlifier';
import { Polynomial, Expression } from 'mathlify';
import { Equation, EquationWorking } from 'mathlify/working';

const mathlifierWriteup = `
## Showing working with Mathlify

In the field of education, showing the steps to get to the answer can be
as important as the answer itself.
Mathlify helps with that via the EquationWorking class.

\`\`\`js
import { Polynomial } from 'mathlify';
import { Equation, EquationWorking } from 'mathlify/working';

const lhs1 = new Polynomial([12, 8]);
const rhs1 = new Polynomial([6, 2]);
const question1 = new Equation(lhs1, rhs1);
const working1 = new EquationWorking(question1);
working1.solve.linear();
\`\`\`


---

`;

const lhs1 = new Polynomial([12, 8]);
const rhs1 = new Polynomial([6, 2]);
const question1 = new Equation(lhs1, rhs1);
const working1 = new EquationWorking(question1);
working1.solve.linear();

const twoThird = new Expression([2, '/', 3]);
const poly2LHS = new Polynomial([9, -12]);
const rhs2 = new Polynomial([8, 2], { ascending: true });
const question2 = new Equation([twoThird, poly2LHS], rhs2);
const working2 = new EquationWorking(question2);
working2.expand();
working2.isolate('x');
working2._makeSubjectFromProduct();

const demoWriteup = md`## 2.3 Solve equations with variables and constants on both sides

### Question 2.63

Solve ${question1}.

### Solution

$${'gather*'} ${working1}

## 2.4 Use a general strategy to solve linear equations

### Question 2.80

Solve ${question2}.

### Solution

$${'gather*'} ${working2}


---

## Copyright and license information

Adapted from OpenStax Elementary Algebra 2e by
Lynn Marecek, MaryAnne Anthony-Smith, Andrea Honeycutt Mathis
under the [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).
Access for free at <https://openstax.org/books/elementary-algebra-2e/pages/1-introduction>.
`;

export const content = mathlifierWriteup + demoWriteup;
