<script>
  import { math, display } from 'mathlifier';
  let num = $state(2);
</script>

<div>
  Inline math (static): {@html math('A = \\pi r^2')}
</div>
<h3>Reactive variables</h3>
<button onclick={() => (num = 1 + Math.floor(Math.random() * 10))}>Randomize numerator</button>
<div>
  Inline math (reactive): {@html (math(`\\frac{${num}}{13}`))}
</div>
<div>
  Display math (reactive): {@html (display(`x = \\frac{${num}}{13}`))}
</div>