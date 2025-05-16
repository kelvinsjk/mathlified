/**
 * Mathlified Index Page Server version 0.0.1
 * generated on 5/15/2025, 5:29:12 PM
 */

import type { PageServerLoad } from './$types';

import { readFileSync } from 'node:fs';
import path from 'node:path';

export const prerender = true;


export const load: PageServerLoad = async ({ depends }) => {
  depends('md');
  const filePath = path.join('./src/content/index.md');
  const { metadata, body } = extractFrontmatter(readFileSync(filePath, 'utf-8'));
  let title: string;
  // 1,2a) prettier workaround: _{} gets converted to \_{}, so we have to change it back in math
  // 1,2b) go from tex $x$ to $`x` djot syntax
  // 3) put punctuation in math inline to prevent awkward line breaks
  // 4) table alignment: prettier-markdown to djot syntax
  // 5) change &dollar;
  let content = body
    .replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match.replaceAll('\\_', '_')}\``)
    .replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match.replaceAll('\\_', '_')}\``)
    .replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`')
    .replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, '$1$2$3')
    .replaceAll('&dollar;', '$');
  if (metadata.title) {
    title = metadata.title;
    content = `# ${metadata.title}\n\n${content}`;
  } else {
    title = 'Mathlified';
  }
  title = title[0].toLocaleUpperCase() + title.slice(1);
  return {
    title,
    content
  };
};

// adapted from https://github.com/sveltejs/site-kit/blob/master/packages/site-kit/src/lib/markdown/utils.js
function extractFrontmatter(markdown: string) {
  const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  if (!match) return { metadata: {}, body: markdown };
  const frontmatter = match[1];
  const body = markdown.slice(match[0].length);

  const metadata: Record<string, string> = {};
  frontmatter.split('\n').forEach((pair) => {
    const i = pair.indexOf(':');
    metadata[pair.slice(0, i).trim()] = removeQuotes(pair.slice(i + 1).trim());
  });

  return { metadata, body };
}
function removeQuotes(str: string) {
  return str.replace(/(^["']|["']$)/g, '');
}
