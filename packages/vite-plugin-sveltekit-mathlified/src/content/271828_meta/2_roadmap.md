# Roadmap

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
use math in these.

### More options

More options exposing what Mathlified does always sound good on paper. We want to think about what
makes sense. A potentially useful options could be to choose the LaTeX engine rather than always
using the default LuaLaTeX.

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
