import type { ExtensionOptions, LatexOptions } from './index';
import fs from 'fs-extra';
import path from 'path';
import { outdent } from 'outdent';

export const defaultExts: { [key: string]: ExtensionOptions } = {
	post: {
		contentHandler: postContentHandler,
	},
	qn: {
		contentHandler: qnContentHandler,
	},
	qns: {
		contentHandler: qnsContentHandler,
	},
};

/**
 * create tex generator
 */
export async function createGenerator(
	ext: 'post' | 'qn' | 'qns',
	file: string,
	hmr: boolean,
	options: LatexOptions,
): Promise<void> {
	// build generator file
	const generatorPath = hmr
		? path.resolve(`./vite-plugin-sveltekit-tex/hmr/texGenerator.ts`)
		: path.resolve(`./vite-plugin-sveltekit-tex/hmr/${file}`, '../texGenerator.ts');
	const generatorData = fs
		.readFileSync('./node_modules/vite-plugin-sveltekit-tex/dist/texGenerator.ts')
		.toString()
		.replaceAll('%fileType%', ext)
		.replaceAll('%fileLocation%', file)
		.replaceAll('%preContent%', preContentTex(options))
		.replaceAll('%postContent%', postContentTex(options));
	fs.outputFileSync(generatorPath, generatorData);
}

function preContentTex(options: LatexOptions): string {
	// tex data generation
	const data1 = outdent`
		\\\\documentclass${options.docOptions}{${options.cls}}
		${options.preDoc}
		\\\\begin{document}
		${options.preContent}
	`;
	return data1;
}
function postContentTex(options: LatexOptions): string {
	const data2 = outdent`
		${options.postContent}
		\\\\end{document}
	`;
	return data2;
}

function postContentHandler(post: Post): string {
	return post.body;
}
function qnContentHandler(qn: Question): string {
	let str = '\\begin{questions}\n\n';
	str += formatQn(qn);
	str += '\n\\end{questions}';
	return str;
}
function qnsContentHandler(qns: Questions): string {
	let str = '\\begin{questions}\n\n';
	qns.qns.forEach((qn) => {
		str += formatQn(qn);
		str += '\n\n';
	});
	str += '\n\\end{questions}';
	return str;
}

function formatQn(qn: Question) {
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

export interface Post {
	title?: string;
	body: string;
}
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
export interface Questions {
	title?: string;
	qns: Question[];
}
