# The qn and qns templates

In my line of work, worksheets are the most common content I produce
so Mathlified ships with the `**/*.qn.ts` and `**/*.qns.ts` extensions.
We will first explore the former.

## LaTeX exam class

I am a big fan of the [LaTeX exam class](https://ctan.org/pkg/exam?lang=en)
and have modeled the qn and qns template after it.

## The qn object

The question object is made up of the main question body, parts and subparts.
Marks can be allocated (but optional), and part/subpart numbering can be customized if
needed. The `uplevel` prop also allow content to break out of its section.

```ts
interface Question {
	title?: string;
	body?: string;
	marks?: number;
	partNo?: number;
	parts?: Part[];
}
interface Part {
	uplevel?: string;
	body?: string;
	marks?: number;
	partNo?: number;
	parts?: SubPart[];
}
interface SubPart {
	uplevel?: string;
	body: string;
	marks?: number;
	partNo?: number;
}
```

## Qn example

```ts
// src/lib/mathlified/my-qn.qn.ts
export const qn: Question = {
	title: 'Qn example',
	body: 'This is the main question body',
	parts: [
		{ body: 'This is part (a).', marks: 2 }
		{ body: 'This part has subparts',
			parts: [
				{ body: 'This is subpart (i).', marks: 3	},
				{
					uplevel: 'This will break out of the subpart space.',
					body: 'This is subpart (ii).', marks: 4
				}
			]
		},
		{ body: 'We can break out of the usual numbering too!', partNo: 5 }
	]
}
```
