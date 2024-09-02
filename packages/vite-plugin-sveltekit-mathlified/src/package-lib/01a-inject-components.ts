import { outputFile } from 'fs-extra/esm';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { date, type InternalOptions } from './utils.js';

export async function injectComponents(
  options: InternalOptions
): Promise<readonly [string[], ...Promise<void>[]]> {
  const inputPath = path.join('src/package-lib/components');
  const outputPath = path.join('src/lib/components/mathlified');
  const components = readdirSync(inputPath);
  const promises: Promise<void>[] = [];
  const componentsNotReplaced: string[] = [];
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
  return [componentsNotReplaced, ...promises] as const;
}
