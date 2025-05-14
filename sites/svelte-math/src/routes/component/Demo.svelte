<script>
  import { Math as M } from 'svelte-math';
  let num = $state(2);
</script>

<h4>With props</h4>
<div>
  Inline: <M latex={'A = \\pi r^2'} />
</div>
<div>
  Display: <M latex={'A = \\pi r^2'} displayMode />
</div>
<h4>With slots</h4>
<div>
  <M displayMode>A = \pi r^2</M>
</div>
<h3>Reactive variables</h3>
<button onclick={() => (num = 1 + Math.floor(Math.random() * 10))}>Randomize numerator</button>
<div>
  <M latex={`\\frac{${num}}{13}`} displayMode />
</div>
