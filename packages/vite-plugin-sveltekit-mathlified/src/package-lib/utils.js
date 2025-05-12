import { createLogger } from 'vite';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import path from 'node:path';
import { existsSync, readdirSync } from 'node:fs';

/**
 * @param {string} x
 * @returns {void}
 */
export function info(x) {
  const logger = createLogger('info', { prefix: '[mathlified]' });
  logger.info(x, { timestamp: true });
}

/**
 * @param {string} x
 * @returns {void}
 */
export function warning(x) {
  const logger = createLogger('warn', { prefix: '[mathlified]' });
  logger.warn(x, { timestamp: true });
}

export const date = new Date().toLocaleString();

/** @typedef {{siteName: string; version: string; disable?: ('layout' | 'autoNav')[]}} InternalOptions */

/**
 *
 * @param {string} x
 * @returns {string}
 */
export function capFirst(x) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

const metaSchema = z
  .object({
    title: z.string().optional(),
    pdf: z.boolean().optional()
  })
  .catchall(z.unknown());
/** @typedef {z.infer<typeof metaSchema>} MetaData */

/**
 *
 * @param {string} markdown
 * @returns {{metadata: MetaData; body: string}}
 */
export function extractFrontmatter(markdown) {
  const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  if (!match) return { metadata: {}, body: markdown };
  const frontmatter = match[1];
  const metadata = metaSchema.parse(parseYaml(frontmatter));
  const body = markdown.slice(match[0].length);
  return { metadata, body };
}

/** @typedef {{name: string; filename: string}} Collection */

// to mimic VS Code:
// https://github.com/microsoft/vscode/blob/main/src/vs/base/common/comparers.ts
export const fileCompareFunction = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
}).compare;

/**
 *
 * @returns {Collection[]}
 */
export function getCollections() {
  const contentFolder = path.resolve('src/content');
  if (!existsSync(contentFolder)) return [];
  const c = readdirSync(path.resolve('src/content'), { withFileTypes: true })
    .filter((x) => x.isDirectory() && !x.name.startsWith('_'))
    .map((x) => {
      return { name: fileToName(x.name), filename: x.name };
    })
    .sort((a, b) => fileCompareFunction(a.filename, b.filename));
  return c;
}

/**
 *
 * @param {string} file
 * @returns {string}
 */
export function fileToName(file) {
  const i = file.indexOf('_');
  return i === -1 ? file : file.slice(i + 1);
}
