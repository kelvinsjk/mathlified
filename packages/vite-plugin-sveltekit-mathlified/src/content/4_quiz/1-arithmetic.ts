import { mathlifierDj } from 'mathlifier';
import { sumVerbatim } from 'mathlify';

export const title = 'Arithmetic';
// evaluate a + b

function getRandomInt(min: number = -9, max: number = 9): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateState() {
  return {
    a: getRandomInt(),
    b: getRandomInt()
  };
}

export function generateQn(state: { a: number; b: number }) {
  const { a, b } = state;
  return {
    qn: mathlifierDj`Evaluate ${sumVerbatim(a, b)}.`,
    ans: mathlifierDj`${a + b}.`
  };
}
