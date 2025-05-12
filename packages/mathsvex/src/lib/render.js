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
 * @type {(markup: string) => string} 
 * converts Markdown/Djot string into HTML
 * 
 * Steps: 
 * 1) transform: convert $$x$$ and $x$ notation to $$`x` and $`x` djot notation
 * 2) parse djot string into djotAST
 * 3) renderHTML from djotAST with math overrides provided by temml
 * */
export function render(markup) {
  return renderHTML(parse(transform(markup)), { overrides })
}


/** 
 * @type {(markup: string) => string} 
 * Transforms Markdown/Djot string
 * 
 * 1,2a) go from tex $x$ to $`x` djot syntax
 * 1,2b) prettier workaround: _{} gets converted to \_{}, so we have to change it back in math
 * 3) put punctuation in math inline to prevent awkward line breaks
 * */
function transform(markup) {
  return markup
  .replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match.replaceAll('\\_', '_')}\``)
  .replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match.replaceAll('\\_', '_')}\``)
  .replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`');
}
