<script module lang="ts">
  /**
   * Standalone package available on https://www.npmjs.com/package/svelte-djot-math
   */
  import { parse, renderHTML, type HTMLRenderer, type Visitor } from '@djot/djot';
  import { djotMathOverride } from './mathlified/Content.svelte';
  import type { Options as TemmlOptions } from 'temml';
  export function djotToHtml(
    markup: string,
    options?: {
      temmlOptions?: TemmlOptions;
      djotHTMLRenderOptions?: Parameters<typeof renderHTML>[1];
      djotParseOptions?: Parameters<typeof parse>[1];
      overrides?: Visitor<HTMLRenderer, string>;
    }
  ): string {
    return renderHTML(parse(markup, options?.djotParseOptions), {
      overrides: { ...djotMathOverride(options?.temmlOptions), ...options?.overrides },
      ...options?.djotHTMLRenderOptions
    });
  }
</script>

<script lang="ts">
  let {
    djot
  }: {
    djot: string;
  } = $props();
</script>

{@html djotToHtml(djot)}
