# Svelte Math

Svelte $\mu \alpha \theta \eta \mu \alpha$.

$$
\mathrm{e}^{\mathrm{i}\pi} = -1
$$

---

## Displaying mathematics in Svelte and SvelteKit

We present 4 methods to display math in Svelte and SvelteKit using [KaTeX](https://katex.org/).

<script>
  import Nav from './_Nav/index.svelte'
</script>

<Nav />

### Our recommendatations

If you are working with only static math, we recommend the KaTeX auto-render extension.
MDsveX with plugins is useful if you are already working with MDsveX.

If dynamic and reactive math is required, we personally prefer the function-based approach as opposed
to using a component.

---

## Comparison of different methods

||`$,$$` syntax|<abbr title="server-side rendering">SSR</abbr>|Dynamic|Reactive|
|---|:---:|:---:|:---:|:---:|
|[KaTeX auto-render extension](./auto-render)|✅||||
|[MDsveX with plugins](https://mdsvex-math-starter.vercel.app/)|✅|✅|||
|[Component-based approach](./component-based)|||✅|✅|
|[Functional-based approach](./function-based)||✅|✅|✅|

### `$,$$` syntax

The ability use LaTeX-style delimiters like `$x+2$` and `$$ax^2+bx+c=0$$` in
our app makes inserting math easy.

### Server-side rendering (SSR)

SSR, along with all its benefits, is a big part SvelteKit. Support for this feature
means that the math we want to render is already sent to the client as HTML without
having the client to render it again with JavaScript.

### Dynamic

We will use the word <dfn>dynamic</dfn> to refer to process of using Javascript
to generate the $LaTeX$ markup to be rendered. This is in contrast to the <dfn>static</dfn>
situation where the $LaTeX$ markup is hand-typed.

For example, rendering `2x^2+3x+4` directly will be considered static, while
the following will be considered dynamic:

```js
const a = 2, b = 3, c = 4;
const expression = `${a}x^2+${b}x+c`;
```

### Reactive

We will use the word <dfn>reactive</dfn> to refer to expressions that will change -- for example,
in response to user input.

The above dynamic example will not be considered reactive if the constants `a,b,c` do not change: there will be
no need to re-render our quadratic expression after the initial render.

It will be considered reactive if the values of `a,b,c` change
in a user session and we will need to re-render our quadratic expression.
