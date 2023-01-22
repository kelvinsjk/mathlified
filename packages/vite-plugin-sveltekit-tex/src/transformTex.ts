export function texToHtml(tex: string): [string, Set<string>] {
	const environments: Set<string> = new Set();
	const data =
		'<p>' +
		tex
			.replace(/(?<!\\)%(.*)/gm, () => {
				return ``;
			})
			.replaceAll('\n\n', '\n\n<p>\n')
			.replace(/(?<![\\])(?<![$])\$(?!\$)(.+)(?<![\\])(?<![$])\$(?!\$)/g, (_, text) => {
				environments.add('math');
				return `{@html math(\`${text}\`)}`;
			})
			.replace(/(?<!\\)\$\$(.+)(?<!\\)\$\$/g, (_, text) => {
				environments.add('display');
				return `{@html display(\`${text}\`)}\n\n<p>`;
			})
			.replace(/\\begin{align}(.+)\\end{align}/gs, (_, env) => {
				environments.add('align');
				return `{@html align(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replace(/\\begin{align\*}(.+)\\end{align\*}/gs, (_, env) => {
				environments.add('alignStar');
				return `{@html alignStar(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replace(/\\begin{alignat}{(.+)}(.+)\\end{alignat}{(.+)}/gs, (_, no, env) => {
				environments.add('alignat');
				return `{@html alignat(\`${env.replace('\\\\', '\\\\\\\\')}\`, ${no})}\n\n<p>`;
			})
			.replace(/\\begin{alignat\*}{(.+)}(.+)\\end{alignat\*}/gs, (_, no, env) => {
				environments.add('alignAtStar');
				return `{@html alignAtStar(\`${env.replace(
					'\\\\',
					'\\\\\\\\',
				)}\`, ${no})}\n\n<p>`;
			})
			.replace(/\\begin{equation}(.+)\\end{equation}/gs, (_, env) => {
				environments.add('equation');
				return `{@html equation(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replace(/\\begin{equation\*}(.+)\\end{equation\*}/gs, (_, env) => {
				environments.add('equationStar');
				return `{@html equationStar(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replace(/\\begin{gather}(.+)\\end{gather}/gs, (_, env) => {
				environments.add('gather');
				return `{@html gather(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replace(/\\begin{gather\*}(.+)\\end{gather\*}/gs, (_, env) => {
				environments.add('gatherStar');
				return `{@html gatherStar(\`${env.replace('\\\\', '\\\\\\\\')}\`)}\n\n<p>`;
			})
			.replaceAll(/\\newline\s{0,}/g, '\n<br>')
			.replaceAll(/\\linebreak\s{0,}/g, '\n<br>')
			.replace(/\\emph{(.+?)}/g, (_, text) => {
				return `<em>${text}</em>`;
			})
			.replace(/\\textbf{(.+?)}/g, (_, text) => {
				return `<b>${text}</b>`;
			})
			.replace(/^# (.+)\n/gm, (_, text) => {
				return `\\section{${text}}\n`;
			})
			.replace(/^## (.+)\n/gm, (_, text) => {
				return `\\subsection{${text}}\n`;
			})
			.replace(/^### (.+)\n/gm, (_, text) => {
				return `\\subsubsection{${text}}\n`;
			});
	return [data, environments];
}

export function texToTex(tex: string): string {
	const data = tex
		.replace(/# (.+)\n^/gm, (_, text) => {
			return `\\section{${text}}\n`;
		})
		.replace(/## (.+)\n^/gm, (_, text) => {
			return `\\subsection{${text}}\n`;
		})
		.replace(/## (.+)\n^/gm, (_, text) => {
			return `\\subsubsection{${text}}\n`;
		});
	return data;
}

export function unSlash(text: string): string {
	return text.replaceAll('\\\\', '\\');
}
