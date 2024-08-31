<script lang="ts">
  import Djot from './Djot.svelte';
  import Content from './Content.svelte';
  import { afterNavigate } from '$app/navigation';

  let {
    data,
    module
  }: {
    data:
      | { isMd: true; content: string }
      | { isMd: false; title: string; state: Record<string, number> };
    module: null | Promise<{
      generateState: () => Record<string, number>;
      generateQn: (state: Record<string, number>) => { qn: string; ans: string };
    }>;
  } = $props();
  async function getNewState() {
    if (module === null) {
      return {};
    }
    return (await module).generateState();
  }
  async function getQn(state: Record<string, number>): Promise<{ qn: string; ans: string }> {
    if (module === null) {
      return { qn: '', ans: '' };
    }
    return (await module).generateQn(state);
  }
  let state: null | Record<string, number> = $state(null);
  let qnState = $derived(data.isMd ? {} : (state ?? data.state));
  let qn = $derived(getQn(qnState));
  afterNavigate(async () => {
    state = await getNewState();
  });
</script>

{#if data.isMd}
  <Content content={data.content} />
{:else}
  <div class="prose-container">
    <div class="content prose">
      <h1>{data.title} Quiz</h1>
      <div class="question-header">
        <h2>Question</h2>
        <button onclick={async () => (state = await getNewState())}> Generate New </button>
      </div>
      <div class="question-content">
        {#await qn}
          Loading...
        {:then { qn }}
          <Djot djot={qn} />
        {/await}
      </div>
      <h2>Answer</h2>
      <div class="answer-content">
        {#await qn}
          Loading...
        {:then { ans }}
          <Djot djot={ans} />
        {/await}
      </div>
    </div>
  </div>
{/if}

<style>
  .prose-container {
    width: 100%;
    height: 100%;
  }
  .prose {
    max-width: 65ch;
    line-height: 1.75;
  }
  .content {
    height: 100%;
    overflow-y: auto;
    padding-inline: 1rem;
    padding-block-start: 1rem;
  }
  .question-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-block-end: 1.5rem;
  }
  .question-header > h2 {
    margin-block: 0;
  }
</style>
