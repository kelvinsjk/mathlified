# Math

The Mathlified framework will not be so named
without some math.

## Inline math

The `math` function from `mathlifier` handles inline math.

Do take note
that as compared to the default LaTeX inline math behavior,
we wrap all inputs with braces to prevent automatic line-breaking.
This can be disabled through the `wrap` option, as shown in the example below.

### Inline math example

```js
// src/lib/mathlified/my-post.post.ts
import { math } from "mathlifier";
export const post = {
	title: "Inline math example",
	body: `We use the math function to handle inline math like ${math(
		"x+y=3."
	)}
		Take note that, by default, this will be converted to "${x+y=3}$"
		to prevent line breaking. We think this approach works better
		especially for mobile viewports, but we then have to be wary of
		the length of our expression.

		To disable this option, or when a long expression is used,
		we can call ${math("x+y=3", { wrap: auto })}
	`,
};
```

`mathlifier` uses KaTeX under the hood so any KaTeX options are passed
along if you want any customizations.
At the present moment `mathlifier2` does not take the KaTeX options into
account when converting to LaTeX markup.

## Displayed math

Displayed math is handled by the `display` function. For responsive
design considerations,
we place the displayed math in a div container styled with
`overflow-x: auto`. Opt out of this behavior via the `overflowAuto` option.

### Displayed math example

```js
// src/lib/mathlified/my-post.post.ts
import { display } from "mathlifier";
export const post = {
	title: "Inline math example",
	body: `We use the display function to handle displayed math like ${display(
		"x+y=3."
	)}
		Take note that, by default, this gets converted to
		<div style="overflow-x: auto">
			"$$ x+ y = 3 $$"
		</div>
		We think this approach works best	for mobile viewports and prevents
		layout shifts.

		To disable this option, ${display("x+y=3", {
			overflowAuto: false,
		})}
	`,
};
```

## Other environments

We have also implemented the following environments to be compatible with both
KaTeX and LaTeX:

- equation, equation\* (`equationStar`)
- gather, gather\* (`gatherStar`)
- align, align\* (`alignStar`)
- alignat, alignat\* (`alignatStar`)

## KaTeX stylesheet

For the SvelteKit pages the KaTeX stylesheet is required.
The default `Post.svelte`, `Qn.svelte` and `Qns.svelte` components ship
with a link to it on a CDN, though you should consider implementing it site-wide
via `+layout.svelte`.
