# Svelte Djot Math

> A Svelte component to render Djot markup, with math rendered into MathML via Temml.

## Getting started

### Installation

```bash
# using pnpm
pnpm i -D svelte-djot-math

# using npm
npm i -D svelte-djot-math
```

### Import in Svelte

```svelte
<script>
	import { Djot } from 'svelte-djot-math';
</script>
```

### Temml css

For the best math rendering, include a temml css and font file when using the component. See the [temml docs](https://temml.org/docs/en/administration#installation) for more details.

## Usage

### With slots

```svelte
<Djot>
	We can use *slots*. Inline math in Djot has the $`x` syntax. We only recommend this for short
	strings due to how whitespace is handled in HTML.
</Djot>
```

### With props

```svelte
<script>
	const djot = 'We can use *props* too. Display math syntax: $$`y`.';
</script>

<Djot {djot} />
```

### Props > slots

```svelte
<Djot djot={'_This_ will be rendered.'}>This will *not* be rendered.</Djot>
```

## Options

You can pass options for the djot parser, the djot renderer (and overrides), and the temml renderer. These are optional props for the component.

Consult the [djot](https://github.com/jgm/djot.js/) and [temml](https://temml.org/docs/en/administration#options) documentations for more details.

```svelte
<Djot
  {djotParseOptions}
  {djotHTMLRenderOptions}
  {overrides}
  {temmlOptions}
>
```
