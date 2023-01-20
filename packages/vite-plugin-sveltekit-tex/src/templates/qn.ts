interface SubPart {
	body: string;
	marks?: string;
	partNo?: number;
}
interface Part {
	body?: string;
	marks?: string;
	parts?: SubPart[];
	partNo?: number;
}
export interface Question {
	title?: string;
	body?: string;
	marks?: string;
	parts?: Part[];
	partNo?: number;
}

export function contentHandler(qn: Question): string {
	let str = '\\begin{questions}\n\n';
	str += formatQn(qn);
	str += '\n\\end{questions}';
	return str;
}

export function formatQn(qn: Question) {
	let str = '\\question';
	if (qn.marks) {
		str += '[' + qn.marks.toString() + ']';
	}
	str += '\n\t';
	if (qn.body) {
		str += qn.body;
	}
	if (qn.parts) {
		str += '\n\t\\begin{parts}';
		qn.parts.forEach((part) => {
			str += '\n\t\t\\part';
			if (part.marks) {
				str += '[' + part.marks.toString() + ']';
			}
			str += '\n\t\t';
			if (part.body) {
				str += '\t' + part.body;
			}
			if (part.parts) {
				str += '\n\t\t\\begin{subparts}';
				part.parts.forEach((subpart) => {
					str += '\n\t\t\t\\subpart';
					if (subpart.marks) {
						str += '[' + subpart.marks.toString() + ']';
					}
					str += '\n\t\t\t';
					if (subpart.body) {
						str += '\t' + subpart.body;
					}
				});
				str += '\n\t\t\\end{subparts}';
			}
		});
		str += '\n\t\\end{parts}';
	}
	return str;
}
