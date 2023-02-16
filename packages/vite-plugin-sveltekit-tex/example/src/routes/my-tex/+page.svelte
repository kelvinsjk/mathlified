<script lang='ts'>
	import { display, math } from 'mathlifier';
      
</script>

<svelte:head>+
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0" crossorigin="anonymous">
</svelte:head>
<div>
<h1>H1</h1>

<p>
Hello {@html math(`x`)}

<p>
<h2>H2</h2>

<p>
<h3>H3</h3>

<p>
<div>{@html display(` x=y `)}
</div>

<p>
</div>
