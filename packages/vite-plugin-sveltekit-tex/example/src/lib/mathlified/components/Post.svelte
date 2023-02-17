<script lang="ts" context="module">
	import type { Post } from '../content-handlers/post';
</script>

<script lang="ts">
	export let post: Post;
</script>

<svelte:head>
	{#if "title" in post}
		<title>{post.title}</title>
	{/if}
</svelte:head>
			
{#if "title" in post}
	<h1>{@html post.title}</h1>
{/if}
	
{@html post.body}