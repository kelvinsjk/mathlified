# Welcome to mathsvex SvelteKit starter

## Static math

With this skeleton setup we can render math
with markup almost exactly like $\LaTeX$.

## Demo

The quadratic equation $ax^2+bx+c=0$ has roots

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Source code (in mathsvex markdown)

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#E1E4E8">The quadratic equation </span><span style="color:#9ECBFF">&dollar;</span><span style="color:#79B8FF">ax^2+bx+c=0</span><span style="color:#9ECBFF">&dollar;</span><span style="color:#E1E4E8"> has roots</span></span><span class="line"></span>
<span class="line"><span style="color:#9ECBFF">
&dollar;&dollar;</span></span>
<span class="line"><span style="color:#79B8FF">x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}</span></span>
<span class="line"><span style="color:#9ECBFF">&dollar;&dollar;</span></span></code></pre>
```

---

## Clone this project

[degit](https://github.com/Rich-Harris/degit) is the fastest way to clone this project.

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#B392F0">npx</span><span style="color:#9ECBFF"> degit</span><span style="color:#9ECBFF"> https://github.com/kelvinsjk/mathlified/sites/mathsvex-starter</span><span style="color:#9ECBFF"> myProject</span></span>
<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> myProject</span></span>
<span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> i</span></span>
<span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> run</span><span style="color:#9ECBFF"> dev</span></span></code></pre>
```

## Recreating this starter yourself

You can also recreate this starter yourself, either because
the packages are out of date in the repo, or if you
have different options (Typescript, ESLint, Prettier, etc) in mind.

### Create SvelteKit app

Use the [Svelte CLI](https://www.npmjs.com/package/sv)
to easily set up a SvelteKit app with your own options (e.g. with or without Typescript, ESLint, Prettier, etc).

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#6A737D"># run the Svelte CLI and follow the prompts</span></span>
<span class="line"><span style="color:#B392F0">npx</span><span style="color:#9ECBFF"> sv</span><span style="color:#9ECBFF"> create</span></span>
<span class="line"><span style="color:#6A737D"># enter and install mathsvex</span></span>
<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> myProject</span></span>
<span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> i</span><span style="color:#79B8FF"> -D</span><span style="color:#9ECBFF"> mathsvex</span></span>
<span class="line"></span></code></pre>
```

### Add preprocessor

We need to add extensions and the `mathsvex` preprocessor to the `svelte.config.js` file.

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#6A737D">// in svelte.config.js</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { mathsvex } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> 'mathsvex'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> config</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8"> extensions: [</span><span style="color:#9ECBFF">'.svelte'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'.md'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'.math.js'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'.math.ts'</span><span style="color:#E1E4E8">],</span></span>
<span class="line"><span style="color:#E1E4E8"> preprocess: [</span><span style="color:#B392F0">vitePreprocess</span><span style="color:#E1E4E8">(), </span><span style="color:#B392F0">mathsvex</span><span style="color:#E1E4E8">()],</span></span>
<span class="line"><span style="color:#F97583">  ...</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"></span></code></pre>
```

### Add font and stylesheets

For best performance, add the 'Temml.woff2' font and the
temml stylesheet for best performance. Refer to [temml docs](https://temml.org/docs/en/administration)
for more details.

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#6A737D">&#x3C;!--in the head element of app.html--></span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">link</span></span>
<span class="line"><span style="color:#B392F0"> rel</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"stylesheet"</span></span>
<span class="line"><span style="color:#B392F0"> href</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">" https://cdn.jsdelivr.net/npm/temml@0.11.6/dist/Temml-Local.min.css "</span></span>
<span class="line"><span style="color:#E1E4E8">/></span></span>
<span class="line"></span></code></pre>
```

### Start developing

```=html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code><span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> run</span><span style="color:#9ECBFF"> dev</span></span>
<span class="line"></span></code></pre>
```
