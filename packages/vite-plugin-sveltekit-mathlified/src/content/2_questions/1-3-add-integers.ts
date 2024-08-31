export const title = 'Add integers';

import { mathlifierDj as md } from 'mathlifier';
import { sumVerbatim } from 'mathlify';

const mathlifierWriteup = `
## Programmatic example

In this page we show how we can programatically generate random questions and answers.

\`\`\`js
import { sumVerbatim } from 'mathlify';
import { mathlifier } from 'mathlifier';

let qns = '';
let ans = '';
for (let i = 0; i < 5; i++) {
  const [a, b] = [getRandomInt(), getRandomInt()];
  const qn = sumVerbatim(a, b);
  qns += mathlifier\`1. \${qn}\\n\`;
  ans += mathlifier\`1. $\{a + b}\\n\`;
}
\`\`\`

---

`;

function getRandomInt(min: number = -9, max: number = 9): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const n = 5;
let qns = '';
let ans = '';
for (let i = 0; i < n; i++) {
  const [a, b] = [getRandomInt(), getRandomInt()];
  const qn = sumVerbatim(a, b);
  qns += md`1. ${qn}\n`;
  ans += md`1. ${a + b}\n`;
}

const demoWriteup = `## Questions

${qns}

## Answers

${ans}
`;

export const content = mathlifierWriteup + demoWriteup;
