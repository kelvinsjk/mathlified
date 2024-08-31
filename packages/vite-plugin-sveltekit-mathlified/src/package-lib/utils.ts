import { createLogger } from 'vite';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import path from 'node:path';
import { readdirSync } from 'node:fs';

export function info(x: string) {
  const logger = createLogger('info', { prefix: '[mathlified]' });
  logger.info(x, { timestamp: true });
}
export function warning(x: string) {
  const logger = createLogger('warn', { prefix: '[mathlified]' });
  logger.warn(x, { timestamp: true });
}

export const date = new Date().toLocaleString();

export interface InternalOptions {
  siteName: string;
  version: string;
  disable?: ('layout' | 'autoNav')[];
}

export function capFirst(x: string) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

const metaSchema = z
  .object({
    title: z.string().optional(),
    pdf: z.boolean().optional()
  })
  .catchall(z.unknown());
export type Metadata = z.infer<typeof metaSchema>;

export function extractFrontmatter(markdown: string): {
  metadata: Metadata;
  body: string;
} {
  const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  if (!match) return { metadata: {}, body: markdown };
  const frontmatter = match[1];
  const metadata = metaSchema.parse(parseYaml(frontmatter));
  const body = markdown.slice(match[0].length);
  return { metadata, body };
}

// const configSchema = z.object({ order: z.record(z.string(), z.number()).optional() });
// export type Config = z.infer<typeof configSchema>;

// export function getYamlConfig(): Config {
// 	const configPath = path.join('src/content/config.yaml');
// 	if (existsSync(configPath)) {
// 		return configSchema.parse(parseYaml(readFileSync(configPath, 'utf-8')));
// 	}
// 	return {};
// }

export interface Collection {
  name: string;
  filename: string;
}
// to mimic VS Code:
// https://github.com/microsoft/vscode/blob/main/src/vs/base/common/comparers.ts
export const fileCompareFunction = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
}).compare;

export function getCollections(): Collection[] {
  const c = readdirSync(path.join('src/content'), { withFileTypes: true })
    .filter((x) => x.isDirectory() && !x.name.startsWith('_'))
    .map((x) => {
      return { name: fileToName(x.name), filename: x.name };
    })
    .sort((a, b) => fileCompareFunction(a.filename, b.filename));
  return c;
}

export function fileToName(file: string): string {
  const i = file.indexOf('_');
  return i === -1 ? file : file.slice(i + 1);
}
