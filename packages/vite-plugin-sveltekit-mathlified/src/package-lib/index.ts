import type { Plugin } from 'vite';
import path from 'node:path';
import { updateNav } from './00-update-nav.js';
import { injectFiles } from './01-inject-files.js';
import { possiblyGeneratePdfFromMd, generatePdfFromTs } from './02-pdf.js';
import colors from 'picocolors';
import { info } from './utils.js';

const version = '0.0.1';
let dev = false;
let autoNav = false;

export interface Options {
  siteName?: string;
  disable?: ('layout' | 'autoNav')[];
}
export function mathlified(options?: Options): Plugin {
  return {
    name: 'vite-plugin-sveltekit-mathlified',
    enforce: 'pre',
    configResolved(config) {
      dev = config.command === 'serve';
      autoNav = !options?.disable?.includes('autoNav');
    },
    async configureServer(server) {
      // only run during dev
      if (!dev) return;
      // set up
      info('Starting setup...');
      if (autoNav) {
        info(`${colors.yellow('autoNav mode')} is enabled`);
      }
      // inject files
      const [[[components], [routes]]] = await Promise.all([
        injectFiles({ version, siteName: options?.siteName ?? 'Mathlified' }),
        updateNav(autoNav)
      ]);
      if (components.length > 0) {
        info(`lib/components already contains ${components.join(', ')} and they are not replaced.`);
      }
      if (routes.length > 0) {
        info(
          `routes/*collection*/[...path]/+page.svelte were detected for the following collections: ${routes.join(', ')} and are not replaced.`
        );
      }

      info(colors.green('Setup complete!'));
      // setup completed

      // watch: update nav, md hmr and generate new pdf
      server.watcher.on('all', async (change, filePath) => {
        if (
          filePath.startsWith(path.resolve('src/content')) &&
          (filePath.endsWith('.md') || filePath.endsWith('.ts'))
        ) {
          updateNav(autoNav);
          if (change === 'add' || change === 'change') {
            if (filePath.endsWith('.md')) {
              server.ws.send({ type: 'custom', event: 'md-update' });
              possiblyGeneratePdfFromMd(filePath);
            } else if (filePath.endsWith('.ts')) {
              //! workaround: it seems like the first call may sometimes get the older version.
              //! calling it twice seems to work
              let module = await server.ssrLoadModule(filePath);
              module = await server.ssrLoadModule(filePath);
              if (module['pdf']) {
                generatePdfFromTs(filePath, module, server);
              }
            }
          }
        }
      });
    }
  };
}
