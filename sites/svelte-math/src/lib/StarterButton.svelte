<script lang="ts">
  let { mdsvex = false }: { mdsvex: boolean } = $props();
  const href = `https://${mdsvex ? 'mdsvex-math' : 'mathsvex'}-starter.vercel.app`
</script>

<a {href}>
  Get started with {mdsvex ? 'mdsvex math' : 'mathsvex'} 
</a>

<style>
  a {
    display: inline-block;
    background-color: midnightblue;
    padding: 1em;
    text-decoration: none;
    color: white;
    border-radius: 0.25em;
  }
  a:hover {
    background-color: darkblue;
  }
</style>