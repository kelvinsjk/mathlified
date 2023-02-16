import { a } from '../../lib/mathlified/a';
import { newline, math } from 'mathlifier';

export const qn = {
	title: 'My qn',
	body: 'Example question body' + a,
	parts: [
		{
			body: 'This is an example question part (with marks). The grid layout makes the output responsive. Modify it via +layout.svelte',
			marks: 5
		},
		{ body: `We can also jump part no ${newline}${math(`x`)}`, partNo: 4 }
	]
};
