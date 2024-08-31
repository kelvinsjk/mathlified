import { outputFile } from 'fs-extra/esm';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { warning, date, type InternalOptions, getCollections, capFirst } from './utils.js';

export async function injectRoutes(options: InternalOptions) {
  const inputPath = path.join('src/package-lib/routes');
  const outputPath = path.join('src/routes');
  const promises: Promise<void>[] = [];
  // collections
  const collections = getCollections();
  const existingCollections: string[] = [];
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
  return [existingCollections, ...promises] as const;
}

function injectCustomRoute(
  data: {
    pagePath: string;
    inputPath: string;
    outputPath: string;
    collection: { name: string; filename: string };
  },
  options: InternalOptions,
  promises: Promise<void>[]
): void {
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

function injectGenericRoute(
  data: {
    pagePath: string;
    inputPath: string;
    outputPath: string;
    collection: { name: string; filename: string };
  },
  options: InternalOptions,
  promises: Promise<void>[]
): void {
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
