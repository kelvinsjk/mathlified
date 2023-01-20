import { type Question, formatQn } from './qn';

export interface Questions {
	title?: string;
	qns: Question[];
}

export function contentHandler(qns: Questions): string {
	let str = '\\begin{questions}\n\n';
	qns.qns.forEach((qn) => {
		str += formatQn(qn);
		str += '\n\n';
	});
	str += '\n\\end{questions}';
	return str;
}
