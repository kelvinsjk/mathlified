import { post } from './src';
import fs from 'fs-extra';
import path from 'path';
import { outdent } from 'outdent';

function formatContent(qnType, file) {
	if (qnType === 'post') {
		return file.body;
	} else if (qnType === 'qn') {
		let str = '\\begin{questions}\n\n';
		str += formatQn(file);
		str += '\n\\end{questions}';
		return str;
	} else if (qnType === 'qns') {
		let str = '\\begin{questions}\n\n';
		file.qns.forEach((q) => {
			str += formatQn(q);
			str += '\n\n';
		});
		str += '\n\\end{questions}';
		return str;
	}
}

function formatQn(qn) {
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

const body = formatContent("post", post);
const preContent = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}
`;
const postContent = outdent`
  
\\end{document}
`;
const tex = preContent + '\n' + body + '\n' + postContent;
fs.outputFileSync(path.resolve('./output/tex/nest1/p2.tex'), tex);
