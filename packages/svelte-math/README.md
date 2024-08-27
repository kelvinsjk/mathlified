# Svelte Math

> A Svelte component to render math with MathML via Temml.

## Getting started

### Installation

```bash
# using pnpm
pnpm i -D svelte-math

# using npm
npm i -D svelte-math
```

### Import in Svelte

```svelte
<script>
	import { Math } from 'svelte-djot-math';
</script>
```

### Temml css

For the best math rendering, include a temml css and font file when using the component. See the [temml docs](https://temml.org/docs/en/administration#installation) for more details.

## Usage

### With slots

```svelte
<Math>x</Math>
```

### With props

```svelte
<script>
	const latex = '\\frac{x}{3}';
</script>

<Math latex="y" />
<Math {latex} />
<Math {latex} displayMode />
```

### Props > slots

```svelte
<Math latex={'z'}>This will *not* be rendered.</Math>
```

## Options

In addition to `displayMode` seen above, you can pass Temml options via the `options` prop.

Consult the [temml](https://temml.org/docs/en/administration#options) documentations for more details.

```svelte
<script>
	const latex = 'x \\in \\R';
	const macros = { '\\R': '\\mathbb{R}' };
	const options = { macros, leqno: true };
</script>

<Math {latex} {options} displayMode />
```
