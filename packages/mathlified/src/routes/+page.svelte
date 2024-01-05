<script lang="ts">
	import { mathlify } from '$lib';

	const a = 2;
	const x = 3;
	const math = mathlify`
We typeset math by using \${...}.

For example,
\${"x=3"} will be typeset as ${'x=3.'}

In fact, math mode continues until the next line break, allowing us to
mix JS and plain ${'\\TeX'}
freely. For example,

\${'x+y'}=\${x}+y will be typeset to ${'x'}=${x}+y
if we have defined the JS variable x to be ${x}.

Remember to start subsequent plain text on a new line or you may end up with
${'x+y'}=${x}+y I forgot to start a new line.

Displayed equations are typeset using \$\${...} and continues until
an empty line (ie double line break) is encountered. For example,

\$\${'ax^2+bx+c'}
<br>=0

typesets to
$${'ax^2+bx+c'}
=0

For plain text, we use @\${...}. For example, @\${'hello world'} will be typeset as @${'hello world'}.

Mathlify contains two opinions. (1): Inline math will be wrapped with braces to prevent line break. We believe this
makes the math content more readable. However, it does mean we have to be careful not to have long expressions
within inline math or it will cause text overflow and styling issues.

For long expressions, consider using displayed math or toggling this behavior off using the @wrap wild card (to be implemented).

(2): Displayed math will be wrapped with a div with class "mathlifier-display"
with an inline-style of "overflow-x:auto". This is to prevent overflow issues.


$${'\\sum abcdefghijklmnopqrstuvwxyz + \\int abcdefghijklmnopqrstuvwxyz - \\prod abcdefghijklmnopqrstuvwxyz'}
\\tag{1}@${{ leqno: true }}
`;
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<h2>Temml</h2>

<div>
	{@html math}
</div>

<style>
	div {
		max-width: 60ch;
	}
</style>
