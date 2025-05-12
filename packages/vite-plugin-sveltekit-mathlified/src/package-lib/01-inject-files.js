/** @typedef {import('./utils.js').InternalOptions} InternalOptions */
import { injectComponents } from './01a-inject-components.js';
import { injectRoutes } from './01c-inject-collections.js';
import { injectRoutes as injectBaseRoutes } from './01b-inject-base-routes.js';

/**
 *
 * @param {InternalOptions} options
 */
export async function injectFiles(options) {
  /** @type {Promise<void[]>[]} */
  const promises = [];
  promises.push(injectBaseRoutes(options));
  return Promise.all([injectComponents(options), injectRoutes(options), ...promises]);
}
