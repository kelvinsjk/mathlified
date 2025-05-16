import { math } from 'mathlifier';
// math is a function that takes a LaTeX string and converts it to HTML

const a = 11;
// b: random number from 1 to 5
const b = Math.floor(Math.random() * 5) + 1;
// c: random number from 6 to 10
const c = Math.floor(Math.random() * 5) + 6;

// answer to ax+b = c is x=(c-b)/a
export const question = `Solve ${math(`${a}x+${b}=${c}.`)}`;
export const answer = math(`x=\\frac{${c - b}}{${a}}`);
