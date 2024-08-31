import type { InternalOptions } from './utils.js';
import { injectComponents } from './01a-inject-components.js';
import { injectRoutes } from './01c-inject-collections.js';
import { injectRoutes as injectBaseRoutes } from './01b-inject-base-routes.js';

export async function injectFiles(options: InternalOptions) {
  const promises: Promise<void[]>[] = [];
  promises.push(injectBaseRoutes(options));
  return Promise.all([injectComponents(options), injectRoutes(options), ...promises]);
}
