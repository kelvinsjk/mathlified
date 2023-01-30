# The Qns Template

A worksheet/exam usually contains more than one question, so
this is where the qns template come in.

## The qns object

The qns object is made up of an array of questions
(each adhering to the `Question` object type from the previous section).

The optional `qns.ans` follow the same structure, allowing us to display the
answers after the questions.

```ts
interface Questions {
	title?: string;
	qns: Question[];
	ans?: Question[];
}
```

## Qns example

```ts
// src/lib/mathlified/my-exam.qns.ts
// q1, q2, etc of the Question object type
// a1, a2 are answers also of the Question object type
export const qns: Questions = {
	title: "Qns example",
	qns: [q1, q2, q3],
	ans: [a1, a2, a3],
};
```
