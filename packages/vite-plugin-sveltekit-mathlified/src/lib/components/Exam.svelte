<script lang="ts">
  import Djot from './Djot.svelte';
  import Content from './mathlified/Content.svelte';
  import type { Exam } from '$lib/server/exam';
  let {
    data
  }: {
    data: { isMd: true; content: string } | { isMd: false; title: string; exam: Exam };
  } = $props();
  let exam = $derived(data.isMd ? [] : data.exam);

  function toRoman(k: number): string {
    return ['i', 'ii', 'iii', 'iv', 'v'][k];
  }

  function texToDjot(tex: string) {
    return tex
      .replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match}\``)
      .replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match}\``)
      .replace(/(?<!\$)(\$`)([^`]+)`([.,?!])/g, '$1$2$3`')
      .replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, '$1$2$3')
      .replaceAll('&dollar;', '$');
  }
</script>

{#if data.isMd}
  <Content content={data.content} />
{:else}
  <div class="prose-container">
    <div class="content prose">
      <h1>{data.title}</h1>
      <div class="exam-grid">
        {#each exam as qn, i}
          <div class="qn-number">{i + 1}.</div>
          {#if qn.body}
            <div class="body-content qn-body" class:span-four={qn.marks === undefined}>
              <Djot djot={texToDjot(qn.body)} />
            </div>
          {/if}
          {#if qn.marks !== undefined}
            <div class="qn-marks">[{qn.marks}]</div>
          {/if}
          {#each qn.parts ?? [] as part, j}
            <div class="part-number">({String.fromCharCode(j + 97)})</div>
            {#if part.body}
              <div class="body-content part-body" class:span-three={part.marks === undefined}>
                <Djot djot={texToDjot(part.body)} />
              </div>
            {/if}
            {#if part.marks !== undefined}
              <div class="part-marks">[{part.marks}]</div>
            {/if}
            {#each part.parts ?? [] as subpart, k}
              <div class="subpart-number">({toRoman(k)})</div>
              {#if subpart.body}
                <div class="body-content subpart-body" class:span-two={subpart.marks === undefined}>
                  <Djot djot={texToDjot(subpart.body)} />
                </div>
              {/if}
              {#if subpart.marks !== undefined}
                <div class="subpart-marks">[{subpart.marks}]</div>
              {/if}
            {/each}
          {/each}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .prose-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .exam-grid {
    display: grid;
    grid-template-columns: auto auto auto 1fr auto;
  }
  .body-content {
    max-width: 65ch;
    line-height: 1.75;
    padding-inline-start: 0.5rem;
  }
  .content {
    height: 100%;
    padding-inline: 1rem;
    padding-block-start: 1rem;
  }
  .qn-body {
    grid-column: span 3;
  }
  .qn-body.span-four {
    grid-column: span 4;
  }
  .part-number {
    grid-column-start: 2;
  }
  .part-body {
    grid-column: span 2;
  }
  .part-body.span-three {
    grid-column: span 3;
  }
  .subpart-number {
    grid-column-start: 3;
  }
  .subpart-body.span-two {
    grid-column: span 2;
  }
  :global(.body-content > p:first-child) {
    margin-block-start: 0;
  }
</style>
