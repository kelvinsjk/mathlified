<script module lang="ts">
  /**
   * Mathlified Content component version %version%
   * generated on %date%
   */
  import {
    parse,
    renderHTML,
    type HTMLRenderer,
    type Visitor,
    type InlineMath,
    type DisplayMath
  } from '@djot/djot';
  import temml from 'temml';
  import type { Options as TemmlOptions } from 'temml';

  export interface Heading {
    level: number;
    text: string;
    children?: Heading[];
  }
  export function getToc(doc: ReturnType<typeof parse>) {
    const flatHeadings = getFlatToc(doc).filter((heading) => heading.level > 1);
    const headings: Heading[] = [];
    const stack: Heading[] = [];
    for (const heading of flatHeadings) {
      const newHeading = { ...heading, children: [] };
      while (stack.length > 0 && (stack.at(-1)?.level ?? 0) >= newHeading.level) {
        stack.pop();
      }
      if (stack.length === 0) {
        headings.push(newHeading);
      } else {
        stack.at(-1)?.children?.push(newHeading);
      }
      stack.push(newHeading);
    }
    return removeEmptyChildren(headings);
  }
  export function djotMathOverride(options?: TemmlOptions): Visitor<HTMLRenderer, string> {
    return {
      inline_math: (node: InlineMath) => {
        return temml.renderToString(node.text, { ...options });
      },
      display_math: (node: DisplayMath) => {
        return temml.renderToString(node.text, { displayMode: true, ...options });
      }
    };
  }
  function getFlatToc(
    doc: ReturnType<typeof parse> | import('@djot/djot').Block
  ): { level: number; text: string }[] {
    const headings: { level: number; text: string }[] = [];
    if (doc.tag === 'thematic_break' || doc.tag === 'code_block' || doc.tag === 'raw_block')
      return headings;
    for (const node of doc.children) {
      if (node.tag === 'heading') {
        // @ts-expect-error investigate djot Inline for text node
        const text = node.children.map((c) => c.text ?? '').join('');
        headings.push({ level: node.level, text });
      } else {
        if (
          node.tag === 'para' ||
          node.tag === 'section' ||
          node.tag === 'div' ||
          node.tag === 'block_quote' ||
          node.tag === 'bullet_list' ||
          node.tag === 'ordered_list' ||
          node.tag === 'task_list' ||
          node.tag === 'definition_list' ||
          node.tag === 'table'
        ) {
          headings.push(...getFlatToc(node));
        }
      }
    }
    return headings;
  }
  function removeEmptyChildren(headings: Heading[]): Heading[] {
    for (const heading of headings) {
      if (heading.children && heading.children.length === 0) {
        delete heading.children;
      } else if (heading.children) {
        removeEmptyChildren(heading.children);
      }
    }
    return headings;
  }
</script>

<script lang="ts">
  /**
   * 60rem breakpoint to get TOC on the right ("desktop")
   * fluid font size at 72rem breakpoint
   *
   * We have implemented selected rules from tailwind typography plugin,
   * removing colors/code/pre, and use block/inline instead of top/left
   *
   * Custom css rules:
   * - pre and code
   * - math display has overflow-x: auto, extra padding at the bottom
   * - images are centered and has display: block
   * - tables have border-collapse: collapse and border color
   */
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import SequentialNav from './SequentialNav.svelte';
  import ToC from './ToC.svelte';

  let { content }: { content: string } = $props();

  const doc = $derived(parse(content));
  const html = $derived(renderHTML(doc, { overrides: djotMathOverride() }));
  const toc = $derived(getToc(doc));

  let proseContainer: HTMLDivElement;
  let pathName = $page.url.pathname;
  beforeNavigate(() => {
    pathName = $page.url.pathname;
  });
  afterNavigate(() => {
    if (pathName !== $page.url.pathname) {
      proseContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
</script>

<div class="content-grid">
  <nav class="toc-container">
    <details class="mobile-toc">
      <summary>
        <svg
          aria-hidden="true"
          class="caret"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style="--sl-icon-size: 1.25rem;"
          ><path
            d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"
          ></path></svg
        >
        On this page
      </summary>
      <ToC {toc} />
    </details>
    <div class="desktop-toc">
      <h2>On this page</h2>
      <ToC {toc} />
    </div>
  </nav>
  <div class="prose-container" bind:this={proseContainer}>
    <div class="prose content">
      {@html html}
      <SequentialNav />
    </div>
  </div>
</div>

<style>
  h2,
  summary {
    font-weight: 600;
    font-size: 1rem;
    padding-block: 0.25rem;
    margin-block: 0.25rem;
  }
  summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1.4;
    cursor: pointer;
  }
  svg {
    width: 1em;
    height: 1em;
    transition: transform 0.2s ease-in-out;
  }
  details[open] > summary > svg {
    transform: rotate(90deg);
  }
  details[open] {
    padding-block-end: 0.5rem;
  }
  .content-grid {
    height: 100%;
    display: grid;
    align-content: flex-start;
    grid-template-columns: 100%;
  }
  .toc-container {
    background-color: var(--surface, hsl(60, 5%, 96%));
    padding-inline: 1rem;
  }
  .desktop-toc {
    display: none;
  }
  @media (min-width: 60rem) {
    .desktop-toc {
      display: block;
    }
    .mobile-toc {
      display: none;
    }
  }
  .prose-container {
    height: 100%;
    overflow-y: auto;
    padding-inline: 1rem;
    padding-block-start: 1rem;
  }
  .content {
    margin-inline: auto;
  }
  @media (min-width: 60rem) {
    .content-grid {
      grid-template-columns: 1fr 18rem;
      align-content: stretch;
    }
    .toc-container {
      order: 2;
      padding-block-start: 1rem;
      height: 100%;
      overflow-y: auto;
      border-inline-start: 1px solid var(--content, black);
    }
  }
  /** make content font size larger for wider viewport.   */
  @media (min-width: 72rem) {
    .content {
      font-size: clamp(1rem, 1vw + 0.25rem, 1.5rem);
    }
  }
  /** custom code style */
  :global(.content code) {
    background-color: var(--surface, hsl(60, 5%, 96%));
    font-family: 'Monaco', monospace;
    padding: 0.25em;
    white-space: pre;
  }
  :global(.content pre) {
    background-color: var(--surface, hsl(60, 5%, 96%));
    padding: 0.5rem;
    border-radius: 1rem;
    width: 100%;
    overflow-x: auto;
  }
  /** math display */
  :global(.content *:has(> math.tml-display)) {
    width: 100%;
    overflow-x: auto;
  }
  :global(math.tml-display) {
    padding-bottom: 0.5rem;
  }
  /** tables */
  :global(.content table) {
    border-collapse: collapse;
  }
  :global(.content table td, .content table th) {
    border: 1px solid var(--surface, hsl(60, 5%, 96%));
  }
  /** center images */
  :global(.content img) {
    margin-inline: auto;
    display: block;
  }
  /** selected rules from tailwind typography plugin. we remove colors/code/pre, and use block/inline instead of top/left */
  :global(.prose) {
    max-width: 65ch;
    line-height: 1.75;
  }
  :global(.prose :where(p):not(:where([class~='not-prose'] *))) {
    margin-block: 1.25em;
  }
  :global(.prose :where([class~='lead']):not(:where([class~='not-prose'] *))) {
    font-size: 1.25em;
    line-height: 1.6;
    margin-block: 1.2em;
  }
  :global(.prose :where(a):not(:where([class~='not-prose'] *))) {
    text-decoration: underline;
    font-weight: 500;
  }
  :global(.prose :where(strong):not(:where([class~='not-prose'] *))) {
    font-weight: 600;
  }
  :global(.prose :where(ol):not(:where([class~='not-prose'] *))) {
    list-style-type: decimal;
    margin-block: 1.25em;
    padding-inline-start: 1.625em;
  }
  :global(.prose :where(ol[type='A']):not(:where([class~='not-prose'] *))) {
    list-style-type: upper-alpha;
  }
  :global(.prose :where(ol[type='a']):not(:where([class~='not-prose'] *))) {
    list-style-type: lower-alpha;
  }
  :global(.prose :where(ol[type='A s']):not(:where([class~='not-prose'] *))) {
    list-style-type: upper-alpha;
  }
  :global(.prose :where(ol[type='a s']):not(:where([class~='not-prose'] *))) {
    list-style-type: lower-alpha;
  }
  :global(.prose :where(ol[type='I']):not(:where([class~='not-prose'] *))) {
    list-style-type: upper-roman;
  }
  :global(.prose :where(ol[type='i']):not(:where([class~='not-prose'] *))) {
    list-style-type: lower-roman;
  }
  :global(.prose :where(ol[type='I s']):not(:where([class~='not-prose'] *))) {
    list-style-type: upper-roman;
  }
  :global(.prose :where(ol[type='i s']):not(:where([class~='not-prose'] *))) {
    list-style-type: lower-roman;
  }
  :global(.prose :where(ol[type='1']):not(:where([class~='not-prose'] *))) {
    list-style-type: decimal;
  }
  :global(.prose :where(ul):not(:where([class~='not-prose'] *))) {
    list-style-type: disc;
    margin-block: 1.25em;
    padding-inline-start: 1.625em;
  }
  :global(.prose :where(ol > li):not(:where([class~='not-prose'] *))::marker) {
    font-weight: 400;
  }
  :global(.prose :where(hr):not(:where([class~='not-prose'] *))) {
    border-block-start-width: 1px;
    margin-block: 3em;
  }
  :global(.prose :where(blockquote):not(:where([class~='not-prose'] *))) {
    font-weight: 500;
    font-style: italic;
    border-inline-start-width: 0.25rem;
    quotes: '“' '”' '‘' '’';
    margin-block: 1.6em;
    padding-inline-start: 1em;
  }
  :global(.prose :where(blockquote p:first-of-type):not(:where([class~='not-prose'] *)):before) {
    content: open-quote;
  }
  :global(.prose :where(blockquote p:last-of-type):not(:where([class~='not-prose'] *)):after) {
    content: close-quote;
  }
  :global(.prose :where(h1):not(:where([class~='not-prose'] *))) {
    font-weight: 800;
    font-size: 2.25em;
    margin-block-start: 0;
    margin-block-end: 0.8888889em;
    line-height: 1.1111111;
  }
  :global(.prose :where(h1 strong):not(:where([class~='not-prose'] *))) {
    font-weight: 900;
  }
  :global(.prose :where(h2):not(:where([class~='not-prose'] *))) {
    font-weight: 700;
    font-size: 1.5em;
    margin-block-start: 2em;
    margin-block-end: 1em;
    line-height: 1.3333333;
  }
  :global(.prose :where(h2 strong):not(:where([class~='not-prose'] *))) {
    font-weight: 800;
  }
  :global(.prose :where(h3):not(:where([class~='not-prose'] *))) {
    font-weight: 600;
    font-size: 1.25em;
    margin-block: 1.6em;
    line-height: 1.6;
  }
  :global(.prose :where(h3 strong):not(:where([class~='not-prose'] *))) {
    font-weight: 700;
  }
  :global(.prose :where(h4):not(:where([class~='not-prose'] *))) {
    font-weight: 600;
    margin-block-start: 1.5em;
    margin-block-end: 0.5em;
    line-height: 1.5;
  }
  :global(.prose :where(h4 strong):not(:where([class~='not-prose'] *))) {
    font-weight: 700;
  }
  :global(.prose :where(img):not(:where([class~='not-prose'] *))) {
    margin-block: 2em;
  }
  :global(.prose :where(figure > *):not(:where([class~='not-prose'] *))) {
    margin-block: 0;
  }
  :global(.prose :where(figcaption):not(:where([class~='not-prose'] *))) {
    font-size: 0.875em;
    line-height: 1.4285714;
    margin-block-start: 0.8571429em;
  }

  :global(.prose :where(table):not(:where([class~='not-prose'] *))) {
    width: 100%;
    table-layout: auto;
    text-align: left;
    margin-block: 2em;
    font-size: 0.875em;
    line-height: 1.7142857;
  }
  :global(.prose :where(thead):not(:where([class~='not-prose'] *))) {
    border-block-end-width: 1px;
  }
  :global(.prose :where(thead th):not(:where([class~='not-prose'] *))) {
    font-weight: 600;
    vertical-align: bottom;
    padding-inline: 0.5714286em;
    padding-block-end: 0.5714286em;
  }
  :global(.prose :where(tbody tr):not(:where([class~='not-prose'] *))) {
    border-block-end: 1px solid black;
  }
  :global(.prose :where(tbody tr:last-child):not(:where([class~='not-prose'] *))) {
    border-block-end-width: 0;
  }
  :global(.prose :where(tbody td):not(:where([class~='not-prose'] *))) {
    vertical-align: baseline;
  }
  :global(.prose :where(tfoot):not(:where([class~='not-prose'] *))) {
    border-block-start-width: 1px;
  }
  :global(.prose :where(tfoot td):not(:where([class~='not-prose'] *))) {
    vertical-align: top;
  }
  :global(.prose :where(video):not(:where([class~='not-prose'] *))) {
    margin-block: 2em;
  }
  :global(.prose :where(figure):not(:where([class~='not-prose'] *))) {
    margin-block: 2em;
  }
  :global(.prose :where(ol > li):not(:where([class~='not-prose'] *))) {
    padding-inline-start: 0.375em;
  }
  :global(.prose :where(ul > li):not(:where([class~='not-prose'] *))) {
    padding-inline-start: 0.375em;
  }
  :global(.prose :where(.prose > ul > li p):not(:where([class~='not-prose'] *))) {
    margin-block: 0.75em;
  }
  :global(.prose :where(.prose > ul > li > *:first-child):not(:where([class~='not-prose'] *))) {
    margin-block-start: 1.25em;
  }
  :global(.prose :where(.prose > ul > li > *:last-child):not(:where([class~='not-prose'] *))) {
    margin-block-end: 1.25em;
  }
  :global(.prose :where(.prose > ol > li > *:first-child):not(:where([class~='not-prose'] *))) {
    margin-block-start: 1.25em;
  }
  :global(.prose :where(.prose > ol > li > *:last-child):not(:where([class~='not-prose'] *))) {
    margin-block-end: 1.25em;
  }
  :global(.prose :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~='not-prose'] *))) {
    margin-block: 0.75em;
  }
  :global(.prose :where(hr + *):not(:where([class~='not-prose'] *))) {
    margin-block-start: 0;
  }
  :global(.prose :where(h2 + *):not(:where([class~='not-prose'] *))) {
    margin-block-start: 0;
  }
  :global(.prose :where(h3 + *):not(:where([class~='not-prose'] *))) {
    margin-block-start: 0;
  }
  :global(.prose :where(h4 + *):not(:where([class~='not-prose'] *))) {
    margin-block-start: 0;
  }
  :global(.prose :where(thead th:first-child):not(:where([class~='not-prose'] *))) {
    padding-inline-start: 0;
  }
  :global(.prose :where(thead th:last-child):not(:where([class~='not-prose'] *))) {
    padding-inline-end: 0;
  }
  :global(.prose :where(tbody td, tfoot td):not(:where([class~='not-prose'] *))) {
    padding: 0.5714286em;
  }
  :global(
      .prose :where(tbody td:first-child, tfoot td:first-child):not(:where([class~='not-prose'] *))
    ) {
    padding-inline-start: 0;
  }
  :global(
      .prose :where(tbody td:last-child, tfoot td:last-child):not(:where([class~='not-prose'] *))
    ) {
    padding-inline-end: 0;
  }
  :global(.prose :where(.prose > :first-child):not(:where([class~='not-prose'] *))) {
    margin-block-start: 0;
  }
  :global(.prose :where(.prose > :last-child):not(:where([class~='not-prose'] *))) {
    margin-block-end: 0;
  }
</style>
