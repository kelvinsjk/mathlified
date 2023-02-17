import { type Question as Qn, formatQn } from './qn';
interface Question extends Qn {
	newpage?: boolean;
}

export interface Questions {
	title?: string;
	qns: Question[];
	ans?: Question[];
}

export function contentHandler(qns: Questions): string {
	let str = '\\begin{questions}\n\n';
	qns.qns.forEach((qn) => {
		if (qn.partNo) {
			str += `\n\\setcounter{question}{${qn.partNo - 1}}`;
		}
		if (qn.newpage) {
			str += `\n\\newpage\n\n`;
		}
		str += formatQn(qn);
		str += '\n\n';
	});
	str += '\n\\end{questions}';
	// answers
	if (qns.ans) {
		str += '\n\n\\newpage\n\n\\section*{Answers}';
		str += '\\begin{enumerate}\n';
		qns.ans.forEach((ans) => {
			if (ans.partNo) {
				str += `\n\t\\setcounter{enumi}{${ans.partNo - 1}}`;
			}
			str += formatAns(ans);
			str += '\n\n';
		});
		str += '\n\\end{enumerate}';
	}
	return str;
}

function formatAns(ans: Question) {
	let str = '\\item';
	str += '\n\t';
	if (ans.body) {
		str += ans.body;
	}
	if (ans.parts) {
		str += '\n\t\\begin{enumerate}';
		ans.parts.forEach((part) => {
			if (part.partNo) {
				str += `\n\t\t\\setcounter{enumii}{${part.partNo - 1}}`;
			}
			str += '\n\t\t\\item';
			str += '\n\t\t';
			if (part.body) {
				str += '\t' + part.body;
			}
			if (part.parts) {
				str += '\n\t\t\\begin{enumerate}';
				part.parts.forEach((subpart) => {
					if (subpart.partNo) {
						str += `\n\t\t\\setcounter{enumiii}{${subpart.partNo - 1}}`;
					}
					str += '\n\t\t\t\\item';
					str += '\n\t\t\t';
					if (subpart.body) {
						str += '\t' + subpart.body;
					}
				});
				str += '\n\t\t\\end{enumerate}';
			}
		});
		str += '\n\t\\end{enumerate}';
	}
	return str;
}
