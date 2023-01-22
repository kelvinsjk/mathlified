<script lang="ts" context="module">
	export interface Post {
		title?: string;
		body: string;
	}
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