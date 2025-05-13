import { parse, renderHTML } from '@djot/djot';
import temml from 'temml';

/**
 * @typedef {Exclude<Parameters<typeof renderHTML>[1],undefined>['overrides'] } Overrides
 */

/** @type {Overrides} */
const overrides = {
  inline_math: (node) => temml.renderToString(node.text),
  display_math: (node) => temml.renderToString(node.text, { displayMode: true }),
}

/** 
 * converts Markdown/Djot string into HTML
 * 
 * 1) transform: convert $$x$$ and $x$ notation to $$`x` and $`x` djot notation
 * 2) parse djot string into djotAST
 * 3) renderHTML from djotAST with math overrides provided by temml
 * 
 * @type {(markup: string) => string} 
 * */
export const render = (markup) => {
  return renderHTML(parse(transform(markup)), { overrides })
}


/** 
 * Transforms Markdown/Djot string before djot parsing
 * 
 * 1,2a) go from tex $x$ to $`x` djot syntax
 * 1,2b) prettier workaround: _{} gets converted to \_{}, so we have to change it back in math
 * 3) put punctuation in math inline to prevent awkward line breaks
 * 4) &dollar; converted to $ for source code workaround
 * 
 * @type {(markup: string) => string} 
 * */
function transform(markup) {
  return markup
  .replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match.replaceAll('\\_', '_')}\``)
  .replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match.replaceAll('\\_', '_')}\``)
  .replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`')
  .replaceAll('&dollar;', '$')
}
