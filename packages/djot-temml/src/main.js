import temml from "temml";

/** @typedef {import('@djot/djot').HTMLRenderer} HTMLRenderer */
/** @typedef {import('@djot/djot').Visitor<HTMLRenderer, string>} Visitor */
/** @typedef {import('temml').Options} TemmlOptions */

/** @type {(options?: TemmlOptions) => Partial<Visitor>} */
export const djotTemml = (options) => {
  return {
    inline_math: (node) => {
      return temml.renderToString(node.text, options);
    },
    display_math: (node) => {
      return temml.renderToString(node.text, { displayMode: true, ...options });
    },
  };
};
