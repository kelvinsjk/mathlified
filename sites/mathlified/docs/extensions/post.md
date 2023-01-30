# The Post Template

The Post is a simple template that gets out of the way.
Export a `post` object from the `post.ts` (or js) file
containing a title (optional) and the body which is
the content that you want to appear.

## The post object

```ts
interface Post {
	title?: string;
	body: string;
}
```

## How the title is handled

At the moment the title is only shown as a `h1` element on the
web but omitted in the LaTeX file. This is because of
a lack of canonical way to display a title in a LaTeX document.
`\maketitle` may be appropriate for longer form content but
way overkill for a short document in my opinion.

## Post example

```ts
// src/lib/mathlified/my-post.post.ts
export const post: Post = {
	title: "My Title",
	body: "This is the content of my webpage and pdf.",
};
```

## A customization starting point

The post template is deliberately kept simple and bare-bones so that
the inner workings of Mathlified can be easily explored.

Look at the `src/lib/mathlified/components/Post.svelte` and
`src/lib/mathlified/content-handler/post.ts` files. These are,
respectively, how Mathlified uses the exported `post` object
to create a webpage and LaTeX document.

Writing your own template involve modifying these two files (along with
potentially the plugin config). In fact, because Mathlified does not
overwrite these files by default, you can just modify them to change how
the post template works to suit your own needs.
