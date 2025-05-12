import { outputFile } from 'fs-extra/esm';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { info, warning, date } from './utils.js';
/** @typedef {import('./utils.js').InternalOptions} InternalOptions */

/**
 *
 * @param {InternalOptions} options
 * @returns {Promise<void[]>}
 */
export async function injectRoutes(options) {
  const inputPath = path.resolve(import.meta.dirname, 'routes');
  const outputPath = path.join('src/routes');
  /** @type {Promise<void>[]} */
  const promises = [];
  // root layout
  if (!options?.disable?.includes('layout')) {
    const layoutPath = path.join(outputPath, '+layout.svelte');
    if (existsSync(layoutPath)) {
      info(`routes/+layout.svelte already exists and is not replaced.`);
    } else {
      promises.push(
        outputFile(
          layoutPath,
          readFileSync(path.join(inputPath, 'index/+layout.svelte'), { encoding: 'utf-8' })
            .replaceAll('%version%', options.version)
            .replaceAll('%date%', date)
            .replaceAll('%siteName%', options.siteName)
            .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
          { flag: 'wx' }
        )
      );
    }
  }
  // home page
  const indexMd = path.join('src/content/index.md');
  if (existsSync(indexMd)) {
    const indexPath = path.join(outputPath, '+page.svelte');
    if (existsSync(indexPath)) {
      info(`routes/+page.svelte already exists and is not replaced.`);
    } else {
      promises.push(
        outputFile(
          indexPath,
          readFileSync(path.join(inputPath, 'generic', '+page.svelte'), { encoding: 'utf-8' })
            .replaceAll('%version%', options.version)
            .replaceAll('%date%', date)
            .replaceAll('%siteName%', options.siteName)
            .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
          { flag: 'wx' }
        )
      );
      // server
      const serverPath = path.join(outputPath, '+page.server.ts');
      if (existsSync(serverPath)) {
        warning(
          `We detected an existing routes/+page.server.ts but not +page.svelte. We only regenerated the +page.svelte file, and left the server file untouched. Is this expected?`
        );
      } else {
        promises.push(
          outputFile(
            serverPath,
            readFileSync(path.join(inputPath, 'index/+page.server.ts'), { encoding: 'utf-8' })
              .replaceAll('%version%', options.version)
              .replaceAll('%date%', date)
              .replaceAll('%siteName%', options.siteName)
              .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
            { flag: 'wx' }
          )
        );
      }
    }
  }
  return Promise.all(promises);
}
