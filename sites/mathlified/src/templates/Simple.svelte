<script>
  let { mod } = $props(); 
  const { question, answer } = $derived(mod);
</script>

<div class="scrollable">
  <h1>Simple custom template</h1>
  
  <h2>Question</h2>
  
  <p>{@html question}</p>
  
  <h2>Answer</h2>
  
  <p>{@html answer}</p>
</div>

<style>
  div {
    padding-inline: 1rem;
  }
  h1 {
    margin-block-start: 0;
  }
</style>

