# Generating custom pages using JavaScript

Working in JavaScript means that we can write content in a general
purpose programming language. The possibilities are limitless!

## Demo

### Question

What is ${a} + {b}$?

### Answer

$${a + b}$$

## Templates

Of course, working within JavaScript now means we need to tell
Mathlified how to handle our files, which can all be very different.
Mathlified uses the idea of "templates" to tackle this problem.

We create a template by writing a Svelte component in the
`src/templates` folder. Any content named `xxx.template.js` (or ts) is
now treated as a _module_ which will be rendered with that Svelte
component. Mathlified will handle the rest in the background.

### The "simple" example

Look at the `src/extensions/Simple.svelte` file to see how we
transform the current file `02-javascript.simple.ts` into a page. The
`module` prop is the JavaScript files we are currently writing.

Our "simple" template expects a single export `markup` which is a
Djot/Markdown string. We then use JavaScript to craft the markup, like
getting random numbers in the demo above.

Now if you create a new \`xxx.simple.js\` (or ts) file in the content
directory, the Svelte component will be used to render the page. Make
sure it has the same structure (eg we expect a \`markup\` export for
the 'simple' extension), and Mathlified will handle the rest for you.

## Exercise

Create a custom template of your own by writing a
\`myTemplate.Svelte\` file in the \`src/templates\` folder, and create
content using this template by adding \`myPage.myTemplate.js\` files
to the \`src/content\` folder.
