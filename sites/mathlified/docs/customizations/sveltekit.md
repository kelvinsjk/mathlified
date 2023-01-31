# Customizing web (SvelteKit) Output

## Relevant files

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD040 -->

```
.
└── src
    ├── lib
    │   ├── mathlified
    │   |   ├── components
    |   |   |   ├── Post.svelte
    |   |   |   ├── Qn.svelte
    |   |   |   └── Qns.svelte
    │   │   ├── **/*.post.ts
    │   │   ├── **/*.qn.ts
    │   │   └── **/*.qns.ts
    └── routes
        └── **/*/+page.svelte
```

<!-- markdownlint-restore -->

On the first server start, the 3 default Svelte components
will be created at `src/lib/mathlified/components`.

Thereafter, on HMR while the dev server is running,
saving a file with the appropriate extension
(e.g. `src/lib/mathlified/my-post.ts`) will generate the
corresponding SvelteKit route file (`src/routes/my-post/+page.svelte`).

::: tip
The component and page files are not overwritten if they are already present.
This allows for your own customizations.

If you wish to revert back to the
defaults, delete the files and Mathlified will generate them on the next
server start/HMR respectively.
:::

## Structure of the `+page.svelte` file

```svelte
<!--src/routes/my-post/+page.svelte-->
<script>
	import { post } from '$lib/mathlified/my-post';
	import Post from '$lib/mathlified/components/Post.svelte';
</script>

<Post { post } />
```

The page route file is kept deliberately simple: most of the heavy
lifting is done by the relevant Svelte component and through
the object structure of each extension.

Custom content specific to a route can then to added to this `+page.svelte`
file. You may also want to consider the
[`+layout.svelte` SvelteKit feature](https://kit.svelte.dev/docs/routing#layout)
for more general customizations of your output.

## The Svelte component

We will use the `post` extension to illustrate.
By default, the `**/*.post.ts` file exports a `post` object with the following structure:

```ts
interface Post {
	title?: string;
	body: string;
}
```

The following is the default `Post.svelte` component, which shows how
the `title` and `body` props are handled.

```svelte
<!--src/lib/mathlified/components/Post.svelte-->
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
```

## Customizing the component

Since the component files are not overwritten, we can then customize our output
by directly modifying the `src/lib/mathlified/components/Post.svelte` file.

For example, we may already have built custom `Title` and `Card` Svelte components to handle the
title and content. We can then incorporate them like in the following example:

### Example customization

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

## Advanced customizations

Advanced customization will involve changing the structure of the exported object. For
example, in addition to the `title` and `body` we now want a `footer` prop.

These will involve changing the exported type from the relevant "content-handler"
(more on that the next section, and optional if types are not important for your use case).

Our Svelte component will now have access to the `post.footer`

### Example of customizing object structure

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
