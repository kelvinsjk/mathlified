# Customizing pdf (LaTeX) Output

## Relevant files

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD040 -->

```
.
└── src
    ├── lib
    │   ├── mathlified
    │   |   ├── content-handlers
    |   |   |   ├── post.ts
    |   |   |   ├── qn.ts
    |   |   |   └── qns.ts
    │   │   ├── **/*.post.ts
    │   │   ├── **/*.qn.ts
    │   │   └── **/*.qns.ts
└── vite.config.ts
```

<!-- markdownlint-restore -->

On the first server start, the 3 default content handlers
will be created at `src/lib/mathlified/content-handlers`.

They will be the files in charge of turning the js/ts extensions
into LaTeX markup.

:::tip
The component and page files are not overwritten if they are already present.
This allows for your own customizations.

Further customizations of the generated TeX file are done via the Plugin options
for `vite-plugin-sveltekit-tex`.
:::

## Structure of the default content-handler

## Customizing the Svelte component

Since the component files are not overwritten, we can then customize our output
by directly modifying the `src/lib/mathlified/components/Post.svelte` file.

For example, we may already have built custom `Title` and `Card` Svelte components to handle the
title and content. We can then incorporate them like in the following example:

### Example `Post.svelte` customization

```svelte
<!--src/lib/mathlified/components/Post.svelte-->
<script lang="ts" context="module">
	import type { Post } from '../content-handlers/post';
</script>

<script lang="ts">
	import Title from '$lib/components/AwesomeTitle.svelte';
	import Card from '$lib/components/FabulousCard.svelte';
	export let post: Post;
</script>

{#if title in post}
<Title>
	{post.title}
</Title>

<Card content={post.body} />
```

## Advanced customizations (object structure)

Advanced customization will involve changing the structure of the exported object. For
example, in addition to the `title` and `body` we now want a `footer` prop.

These will involve changing the exported type from the relevant "content-handler"
(more on that the next section, and optional if types are not important for your use case).

Our Svelte component will now have access to the `post.footer`

### Example `Post.svelte` customization of object structure

```svelte
<!--src/lib/mathlified/components/Post.svelte-->
<script lang="ts" context="module">
	import type { Post } from '../content-handlers/post';
	// post is now of type
	// { title?: string, body: string, footer: string }
</script>

<script lang="ts">
	import MyFooter from '$lib/components/MyFooter.svelte';
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

<MyFooter>
	{post.footer}
</MyFooter>
```
