import { mathlifierDj } from 'mathlifier';
import { Polynomial } from 'mathlify';
import { Equation, EquationWorking } from 'mathlify/working';

export const title = 'Algebra';
// evaluate ax+b = c

function getRandomInt(min: number = -9, max: number = 9): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateState() {
  const a = getRandomInt();
  const b = getRandomInt();
  const c = getRandomInt();
  if (a === 0 || (a === 1 && b === 0)) return generateState();
  return {
    a,
    b,
    c
  };
}

export function generateQn(state: { a: number; b: number; c: number }) {
  const { a, b, c } = state;
  const poly = new Polynomial([a, b]);
  const eqn = new Equation(poly, c);
  const working = new EquationWorking(eqn);
  working.solve.linear();
  return {
    qn: mathlifierDj`Solve the follow equation $${eqn}.`,
    ans: mathlifierDj`$${'gather*'}${working}`
  };
}
