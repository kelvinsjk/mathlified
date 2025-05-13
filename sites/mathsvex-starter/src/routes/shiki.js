import { codeToHtml } from 'shiki';
console.log(
  await codeToHtml(
`const x = Math.ceil(Math.random() * 100);

export const contents = 
\`# Dynamic math in markdown

Coding *dynamic* mathematical content
...

## Demo

This value $ x=\${x}$; and the following are generated dynamically:

&dollar;&dollar; x^2 = &dollar;{x * x} &dollar;&dollar;

Reload the page to see new values.
\`
`,
    {
      lang: 'js',
      theme: 'github-dark'
    }
  )
);