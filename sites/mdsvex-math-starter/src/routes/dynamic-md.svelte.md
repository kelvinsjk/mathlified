# Dynamic math in markdown

Coding dynamic mathematical content takes an extra step

## Demo

This value {@html inlineMath} and the following are generated dynamically:

{@html displayedMath}

Reload the page to see new values.

## Source code (in markdown/mdsvex)

```markdown
<script>
  import {math, display} from 'mathlifier';
  const x = Math.ceil(Math.random()*100)
  const inlineMath = math(`x=${x}`);
  const displayedMath = display(`x^2 = ${x*x}`);
</script>
This value {@html inlineMath} and the following are generated dynamically:

{@html displayedMath2}

Reload the page to see new values.
```

## Dynamic math in svelte

Truly dynamic and reactive content are probably better served in a svelte file instead.

<script>
  import {math, display} from 'mathlifier';
  const x = Math.ceil(Math.random()*100)
  const inlineMath = math(`x=${x}`);
  const displayedMath = display(`x^2 = ${x*x}`, {overflowAuto: false});
  const displayedMath2 = display(`x^2 = ${x*x}`);
</script>
