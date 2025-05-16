let dev = false;
const webExtensions: string[] = ['.md'];
const pdfExtensions: string[] = ['.md'];
import { exec } from 'node:child_process';
import { createLogger } from 'vite';
import colors from 'picocolors';

const logger = createLogger('info', { prefix: '[mathlified]' });
const info = (x: string) => logger.info(x, { timestamp: true });
const error = (x: string) => logger.error(x, { timestamp: true });
const success = (x: string, file: string) =>
	logger.info(colors.green(x) + ' ' + file, { timestamp: true });

export function mathlified(): import('vite').Plugin {
	return {
		name: 'mathlified',
		configResolved(config) {
			dev = config.command === 'serve';
			if (dev) {
				getTemplates();
				generateTOC();
			}
		},
		async configureServer(server) {
			// only run during dev
			if (!dev) return;
			// todo: get extensions
		},

		async handleHotUpdate({ file, read, server }) {
			const leadingFileName = `${cwd()}/src/content/`;
			if (file.startsWith(leadingFileName) && file.endsWith('.md')) {
				server.ws.send({ type: 'custom', event: 'md-update' });
				const { attributes, body } = fm(await read());
				if (
					attributes !== null &&
					typeof attributes === 'object' &&
					'pdf' in attributes &&
					attributes.pdf
				) {
					info('Generating pdf...');
					outputFileSync('./.mathlified/temp.dj', body);
					const fileName = file.slice(leadingFileName.length, file.length - 3);
					outputFileSync(`./output/${fileName}.pdf`, '');
					exec(
						`djot -t pandoc ./.mathlified/temp.dj | pandoc -f json -s -t pdf -o ./output/${fileName}.pdf`,
						(err, _, stderr) => {
							if (err) {
								error(`Error generating pdf! ${err.message}`);
							} else if (stderr) {
								error(`Error generating pdf! stderr: ${stderr}`);
							} else {
								success(`PDF generated`, `output/${fileName}.pdf`);
								unlink('./.mathlified/temp.dj');
							}
						}
					);
				}
			}
		}
	};
}

type Page = { name: string; slug: string; path: string; filePath: string; ext: string };
export type Section = { name: string; slug: string; pages: Page[] };
import slugify from 'slugify';
import { readdirSync } from 'node:fs';
import { outputFile, outputFileSync } from 'fs-extra/esm';
import { format } from 'prettier';
import { cwd } from 'node:process';
import fm from 'front-matter';
import { unlink } from 'node:fs/promises';

const mdMatches: string[] = [''];
const mdFiles: string[] = ['index.md'];
const matches: Record<string, [string[], string[]]> = {
	md: [mdMatches, mdFiles]
};

async function getTemplates() {
	const docs = readdirSync('./src/templates/', { withFileTypes: true });
	for (const doc of docs) {
		if (!doc.isDirectory() && !doc.name.endsWith('.md')) {
			if (doc.name.endsWith('.svelte')) {
				const fileName = doc.name.slice(0, doc.name.length - 7);
				const lowerCased = fileName[0].toLowerCase() + fileName.slice(1);
				webExtensions.push(`.${lowerCased}.js`, `.${lowerCased}.ts`);
				matches[lowerCased] = [[], []];
			}
		}
	}
}

async function generateTOC() {
	const sections: Section[] = [];
	const docs = readdirSync('./src/content/', { withFileTypes: true });
	for (const doc of docs) {
		if (doc.isDirectory()) {
			const section = doc.name;
			const pages: Page[] = [];
			const sectionName = replaceLeadingDigitsDash(section);
			const sectionSlug = slugify(sectionName);
			sections.push({ name: sectionName, slug: sectionSlug, pages });
			const files = readdirSync(`./src/content/${section}/`, { withFileTypes: true });
			for (const file of files) {
				if (!file.isDirectory()) {
					const extRemoval = removeExtension(replaceLeadingDigitsDash(file.name));
					if (extRemoval === undefined) continue;
					const [fileName, ext] = extRemoval;
					const slug = slugify(fileName);
					const path = `${sectionSlug}/${slug}`;
					const filePath = `${section}/${file.name}`;
					pages.push({ name: fileName, slug, filePath, path, ext });
					addToParamMatcher(file.name, path, filePath);
				}
			}
		}
	}
	const prettyString = await format(JSON.stringify(sections), { parser: 'json' });
	// toc
	const promises = [outputFile('./src/mathlified/toc.json', prettyString)];

	for (const [ext, arr] of Object.entries(matches)) {
		// extensions
		const prettyString = await format(JSON.stringify(arr), { parser: 'json' });
		promises.push(outputFile(`./src/mathlified/${ext}.json`, prettyString));
	}
	await Promise.all(promises);
	return;
}

function replaceLeadingDigitsDash(str: string) {
	return str.replace(/(^|\/)[\d-]+[a-z]?-/g, '$1');
}

/**
 * @param str file name
 * @returns [fileWithoutExtension, extension] or undefined
 */
function removeExtension(str: string): [string, string] | undefined {
	for (const ext of webExtensions) {
		if (str.endsWith(ext)) {
			return [str.slice(0, str.length - ext.length), ext.slice(1)];
		}
	}
	return undefined;
}

function addToParamMatcher(fileName: string, path: string, filePath: string) {
	for (const ext of webExtensions) {
		if (fileName.endsWith(ext)) {
			const end = ext === '.md' ? ext.length : ext.length - 3;
			matches[ext.slice(1, end)][0].push(path);
			matches[ext.slice(1, end)][1].push(filePath);
		}
	}
}

// some code modified from
// https://github.com/sveltejs/svelte.dev/blob/main/packages/site-kit/src/lib/server/content/index.ts
