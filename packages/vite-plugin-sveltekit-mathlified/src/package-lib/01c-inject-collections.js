import { outputFile } from 'fs-extra/esm';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { warning, date, getCollections, capFirst } from './utils.js';
/** @typedef {import('./utils.js').InternalOptions} InternalOptions */

/**
 *
 * @param {InternalOptions} options
 * @returns {Promise<[string[], ...Promise<void>[]]>}
 */
export async function injectRoutes(options) {
  const inputPath = path.resolve(import.meta.dirname, 'routes');
  const outputPath = path.join('src/routes');
  /** @type {Promise<void>[]} */
  const promises = [];
  // collections
  const collections = getCollections();
  /** @type {string[]} */
  const existingCollections = [];
  for (const collection of collections) {
    const pagePath = path.join(outputPath, collection.name, '[...path]', '+page.svelte');
    if (existsSync(pagePath)) {
      existingCollections.push(collection.name);
      continue;
    }
    // look for custom behavior
    const preprocessorPath = path.join('src/lib/server', collection.name + '.ts');
    const preprocessorExists = existsSync(preprocessorPath);
    const componentPath = path.join('src/lib/components', capFirst(collection.name) + '.svelte');
    const componentExists = existsSync(componentPath);
    if (preprocessorExists || componentExists) {
      if (preprocessorExists && componentExists) {
        injectCustomRoute({ pagePath, inputPath, outputPath, collection }, options, promises);
      } else {
        warning(
          `we only detected one of ${preprocessorPath} and ${componentPath}. No action will be taken until both files are present (or delete both for default behavior)`
        );
      }
    } else {
      injectGenericRoute({ pagePath, inputPath, outputPath, collection }, options, promises);
    }
  }
  return [existingCollections, ...promises];
}

/**
 *
 * @param {{pagePath: string, inputPath: string, outputPath: string, collection: {name: string, filename: string}}} data
 * @param {InternalOptions} options
 * @param {Promise<void>[]} promises
 */
function injectCustomRoute(data, options, promises) {
  const { pagePath, inputPath, outputPath, collection } = data;
  promises.push(
    outputFile(
      pagePath,
      readFileSync(path.join(inputPath, 'custom/+page.svelte'), { encoding: 'utf-8' })
        .replaceAll('%version%', options.version)
        .replaceAll('%date%', date)
        .replaceAll('%collection-filename%', collection.filename)
        .replaceAll('%Collection%', capFirst(collection.name))
        .replaceAll('CustomComponent', capFirst(collection.name))
        .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
      { flag: 'wx' }
    )
  );
  const serverPath = path.join(outputPath, collection.name, '[...path]', '+page.server.ts');
  if (existsSync(serverPath)) {
    warning(
      `We detected an existing routes/${collection}/[...path]/+page.server.ts but not +page.svelte. We only regenerated the +page.svelte file, and left the server file untouched. Is this expected?`
    );
  } else {
    promises.push(
      outputFile(
        serverPath,
        readFileSync(path.join(inputPath, 'custom/+page.server.ts'), { encoding: 'utf-8' })
          .replaceAll('%version%', options.version)
          .replaceAll('%date%', date)
          .replaceAll('%collection%', collection.name)
          .replaceAll('%collection-filename%', collection.filename)
          .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
        { flag: 'wx' }
      )
    );
  }
}

/**
 *
 * @param {{pagePath: string, inputPath: string, outputPath: string, collection: {name: string, filename: string}}} data
 * @param {InternalOptions} options
 * @param {Promise<void>[]} promises
 */
function injectGenericRoute(data, options, promises) {
  const { pagePath, inputPath, outputPath, collection } = data;
  promises.push(
    outputFile(
      pagePath,
      readFileSync(path.join(inputPath, 'generic/+page.svelte'), { encoding: 'utf-8' })
        .replaceAll('%version%', options.version)
        .replaceAll('%date%', date)
        .replaceAll('%collection%', collection.name)
        .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
      { flag: 'wx' }
    )
  );
  const serverPath = path.join(outputPath, collection.name, '[...path]', '+page.server.ts');
  if (existsSync(serverPath)) {
    warning(
      `We detected an existing routes/${collection}/[...path]/+page.server.ts but not +page.svelte. We only regenerated the +page.svelte file, and left the server file untouched. Is this expected?`
    );
  } else {
    promises.push(
      outputFile(
        serverPath,
        readFileSync(path.join(inputPath, 'generic/+page.server.ts'), { encoding: 'utf-8' })
          .replaceAll('%version%', options.version)
          .replaceAll('%date%', date)
          .replaceAll('%collection%', collection.name)
          .replaceAll('%collection-filename%', collection.filename)
          .replaceAll('//@ts-expect-error (this line will be removed during injection)', ''),
        { flag: 'wx' }
      )
    );
  }
}
