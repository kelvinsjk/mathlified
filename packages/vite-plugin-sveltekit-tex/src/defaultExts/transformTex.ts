export function texToHtml(tex: string): [string, Set<string>] {
	const environments: Set<string> = new Set();
	let data = tex
		.replace(/(?<!\\)%(.*)/gm, () => {
			return ``;
		})
		.replaceAll('\n\n', '\n\n<p>\n')
		.replace(/(?<!\\)\$\$(.+)(?<!\\)\$\$/g, (_, text) => {
			environments.add('display');
			return `<div>{@html display(\`${text.replaceAll('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replace(/(?<![\\])(?<![$])\$(?!\$)(.+)(?<![\\])(?<![$])\$(?!\$)/g, (_, text) => {
			environments.add('math');
			return `{@html math(\`${text.replaceAll('\\', '\\\\')}\`)}`;
		})
		.replace(/\\begin{align}(.+?)\\end{align}/gs, (_, env) => {
			environments.add('align');
			return `<div>{@html align(\`${env.replaceAll('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{align\*}(.+?)\\end{align\*}/gs, (_, env) => {
			environments.add('alignStar');
			return `<div>{@html alignStar(\`${env.replaceAll('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{alignat}{(.+?)}(.+)\\end{alignat}{(.+)}/gs, (_, no, env) => {
			environments.add('alignat');
			return `<div>{@html alignat(\`${env.replaceAll(
				'\\',
				'\\\\',
			)}\`, ${no})\n</div>\n\n<p>`;
		})
		.replace(/\\begin{alignat\*}{(.+?)}(.+)\\end{alignat\*}/gs, (_, no, env) => {
			environments.add('alignatStar');
			return `<div>{@html alignatStar(\`${env.replaceAll(
				'\\',
				'\\\\',
			)}\`, ${no})}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{equation}(.+?)\\end{equation}/gs, (_, env) => {
			environments.add('equation');
			return `<div>{@html equation(\`${env.replaceAll('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{equation\*}(.+?)\\end{equation\*}/gs, (_, env) => {
			environments.add('equationStar');
			return `<div>{@html equationStar(\`${env.replaceAll(
				'\\',
				'\\\\',
			)}\`)}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{gather}(.+?)\\end{gather}/gs, (_, env) => {
			environments.add('gather');
			return `<div>{@html gather(\`${env.replace('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replace(/\\begin{gather\*}(.+?)\\end{gather\*}/gs, (_, env) => {
			environments.add('gatherStar');
			return `<div>{@html gatherStar(\`${env.replace('\\', '\\\\')}\`)}\n</div>\n\n<p>`;
		})
		.replaceAll(/\\newline\s{0,}/g, '\n<br>')
		.replaceAll(/\\linebreak\s{0,}/g, '\n<br>')
		.replace(/\\emph{(.+?)}/g, (_, text) => {
			return `<em>${text}</em>`;
		})
		.replace(/\\textbf{(.+?)}/g, (_, text) => {
			return `<b>${text}</b>`;
		})
		.replace(/^### (.+?)\r?\n$/gm, (_, text) => {
			return `<h3>${text}</h3>\n`;
		})
		.replace(/^## (.+?)\r?\n$/gm, (_, text) => {
			return `<h2>${text}</h2>\n`;
		})
		.replace(/^# (.+?)\r?\n$/gm, (_, text) => {
			return `<h1>${text}</h1>\n`;
		});
	data = data[0] === '<' ? data : '<p>' + data;
	return [data, environments];
}

export function texToTex(tex: string): string {
	const data = tex
		.replace(/^### (.+?)\r?\n$/gm, (_, text) => {
			return `\\subsubsection{${text}}\n`;
		})
		.replace(/^## (.+?)\r?\n$/gm, (_, text) => {
			return `\\subsection{${text}}\n`;
		})
		.replace(/^# (.+?)\r?\n$/gm, (_, text) => {
			return `\\section{${text}}\n`;
		});
	return data;
}

export function unSlash(text: string): string {
	return text.replaceAll('\\\\', '\\');
}
