import type { Exam } from '$lib/server/exam';
export const title = 'Exam';
export const pdf = true;

export const exam: Exam = [
  {
    body: 'What is $1+2$?',
    marks: 1
  },
  {
    parts: [
      { body: 'Simplify $x+2x$.', marks: 1 },
      { body: 'Solve $x+2x=3$.', marks: 2 }
    ]
  },
  {
    body: 'Solve the following equations:',
    parts: [
      { body: '$2x+1=3$.', marks: 2 },
      { body: '$2x+a=b$.', marks: 3 }
    ]
  },
  {
    parts: [
      {
        body: 'Solve the following equations:',
        parts: [{ body: '$2x+1=2$.' }, { body: '$2x+1=x-2$.', marks: 3 }]
      },
      {
        body: 'Differentiate $x^2+3x-2$.',
        marks: 2
      }
    ]
  }
];
