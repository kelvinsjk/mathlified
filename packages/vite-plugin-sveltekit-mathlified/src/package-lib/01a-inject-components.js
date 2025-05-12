import { outputFile } from 'fs-extra/esm';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { date } from './utils.js';
/** @typedef {import('./utils.js').InternalOptions} InternalOptions */

/**
 *
 * @param {InternalOptions} options
 * @returns {Promise<[string[], ...Promise<void>[]]>}
 */
export async function injectComponents(options) {
  const inputPath = path.resolve(import.meta.dirname, 'components');
  const outputPath = path.join('src/lib/components/mathlified');
  const components = readdirSync(inputPath);
  /** @type {Promise<void>[]} */
  const promises = [];
  /** @type {string[]} */
  const componentsNotReplaced = [];
  for (const component of components) {
    const componentPath = path.join(outputPath, component);
    if (existsSync(componentPath)) {
      componentsNotReplaced.push(component);
      continue;
    }
    promises.push(
      outputFile(
        path.join(outputPath, component),
        readFileSync(path.join(inputPath, component), { encoding: 'utf-8' })
          .replaceAll('%version%', options.version)
          .replaceAll('%date%', date)
          .replaceAll('%siteName%', options.siteName)
          .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
        { flag: 'wx' }
      )
    );
  }
  return [componentsNotReplaced, ...promises];
}
