---
title: 2.1 A preview of calculus
---

## More about Mathlified

### A confession

We have highlighted the use of Markdown throughout these notes. It turns out that we aren't using Markdown in Mathlified. Instead, we use [Djot](https://djot.net/) (with Mathlified translating `&dollar;x&dollar;` math syntax into the equivalent Djot markup).

For short and simple use cases, we absolutely love the simplicity of Markdown and its wide adoption in many applications. However, our personal attempts to use it for more complicated situations (often trying to incorporate dynamic content and math) have often led us down frustrating paths. The potentially ambiguity of Markdown along with the different feature sets in different implementations often made unexpected outputs difficult to nail down.

John Macfarlane's [beyond markdown essay](https://johnmacfarlane.net/beyond-markdown.html) is a great read, and when he created Djot, I immediately took it out for a spin. So far we have been quite happy working with Djot in Mathlified, and see it as the base language to build on to produce both web content and LaTeX pdfs.

We would love to turn all our `content.md` files to `content.dj` in the future. But in the meantime, the name recognition and tooling support of the Markdown ecosystem means we do a bit of bait-and-switch. Thankfully Djot is largely similar to Markdown. So far we've only had to do a few find-and-replace to ensure we get the features we want in Mathlified.

### To infinity and beyond

We think the discussions covered up until this point is sufficient for you to go out and create your own content. We can't wait to see what everyone will be able to create and would love to hear from you on GitHub discussions on your experience.

From this point onwards I see a couple of potential paths ahead. You can dive deep just creating content and share it with the rest of the world. If you are new to the world of web development and Svelte/SvelteKit, then that could be a place to explore to change how the site looks and functions. Or you can continue with the demo and tutorial over here as we cover advanced features of Mathlified.

---

## The Tangent Problem and Differential Calculus

Rate of change is one of the most critical concepts in calculus.

We can approximate the rate of change of a function $f(x)$ at a point $(a,f(a))$ on its graph by taking another point $(x,f(x))$ on the graph of $f(x)$, drawing a line through the two points, and calculating the slope of the resulting line. Such a line is called a **secant** line.

Definition

The secant to the function $f(x)$ through the points $(a,f(a))$ and $(x,f(x))$ is the line passing through these points. Its slope is given by

$$m_{\text{sec}} = \frac{f(x)-f(a)}{x-a}. $$

---

## Copyright and license information

Adapted from OpenStax Calculus Volume 1 by Gilbert Strange and Edwin "Jed" Herman, under the [Creative Commons Attribution-NonCommercial-ShareAlike License](http://creativecommons.org/licenses/by-nc-sa/4.0/). Access for free at <https://openstax.org/books/calculus-volume-1/pages/1-introduction>.
