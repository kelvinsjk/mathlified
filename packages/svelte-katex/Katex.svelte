<script >import katex from 'katex';
import { afterUpdate } from 'svelte';
export let displayMode = false;
let output;
let latex;
// trigger re-rendering on state change
afterUpdate(async () => {
    katex.render(latex.textContent, output, { displayMode });
});
</script>

<!--LaTeX markout passed through slot stored in a hidden node-->
<span bind:this={latex} style="display: none;">
	<slot />
</span>

<!-- Display rendered math-->
<span bind:this={output} />
