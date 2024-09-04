---
title: Roadmap
---

It is a bit presumptuous to call this a roadmap, with this being more of the thoughts that went
through my mind when I am building Mathlified, and some indication on what I may or may not work on
in the future. That string of text is a bit too long for a title, so a roadmap it is.

## Discuss on GitHub

At this moment, I am working on [mathlify.com](https://mathlify.com), and will likely port any
features which I think can be abstracted out here.

If you start using Mathlified, do reach out on GitHub to discuss things you will like: options,
features, etc.

## Potential future features

### Rich content (eg math) in titles

At this moment our `Nav` and `ToC` components only use plain text for the headings. We may want to
use math in these. The `Nav` component uses the title (either from the file name or `title` front
matter or export), which may contain math markup delimited by `&dollar;`. The `ToC` component gets
the heading from the Djot AST, using only the `text` part of the node. We will need to handle the
`inline_math` tagged nodes to support this feature.

### More options

More options exposing what Mathlified does always sound good on paper. We want to think about what
makes sense. A potentially useful options could be to choose the LaTeX engine rather than always
using the default LuaLaTeX.

### `lib` folder structure

Currently Mathlified stores its components in `lib/components/mathlified`, and gets looks for
customized content collections in the `lib/components` and `lib/server` folder. This doesn't feel
like the best solution (the separate folders to go to), but I also don't want for those files to be
deeply nested. We will want to change this for the future, and should standardize on a structure for
1.0.

### ToC current section

My initial draft included highlighting of the current section in the ToC component via an
intersection observer. However, I still have details I want to iron out (what is the appropriate
heading to highlight when we have a few on screen?) before fully including it in.
[Stripe's ToC](https://docs.stripe.com/dashboard/basics) is the benchmark I will like to hit.

### Streamlining custom content creation

I think the workflow for creating custom content (via the preprocessors, toTex and custom component)
can be streamlined. In particular, finding a good abstraction for types: both on user-land and in
the Mathlified plugin is probably a good first step.

### Included components: via file injection or as dependency

We currently inject the default components into users' projects. We think this makes things easiest
for people who are new to this area, allowing them to inspect the code to modify to their liking.
However, this could pose problems with keeping things up to date. We may want to move all the
components out to a separate library (eg the Svelte SiteKit library).

### Scroll position

Our scroll position in the `Content` component is discarded when moving from one page to another. We
can use [SvelteKit snapshot](https://kit.svelte.dev/docs/snapshots) to restore this on navigation.

## Known bugs

### ToC links

We currently use the following line

```svelte
{@const id = heading.text.replaceAll(' ', '-').replaceAll(',', '')}
```

to create the `id` for the ToC link. It works use cases, but fails for more complicated headings
that includes math and symbols like parenthesis. To fix this we should create an `id` property when
generating the `ToC` component from the Djot AST.

### Image processing

Our `Content.svelte` has the following css

```css
:global(.content img) {
  margin-inline: auto;
  display: block;
}
```

to center images (vs the default inline behavior by the Djot renderer). This causes difference in
the web output vs the PDF one. We should standardize the behavior in the future.

Image captions is also something [Djot doesn't support yet](https://github.com/jgm/djot/issues/28).
This will be a useful addition in the future.
