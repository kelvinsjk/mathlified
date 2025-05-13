const x = Math.ceil(Math.random() * 100);

export const contents = `# Dynamic math in markdown

Coding *dynamic* mathematical content is easier in a JavaScript file like this,
where we make use of template literals.

The \`mathsvex\` preprocessor will look at files ending with \`.math.js\` (or ts). These 
files should define a contents file, which is either a Markdown string or an array (see 
[the next example](/dynamic-md-2)). Any math delimited by dollar signs will be handled accordingly.

## Demo

This value $ x=${x} $ and the following are generated dynamically:

$$ x^2 = ${x * x} $$

Reload the page to see new values.

## Source code 

\`\`\` =html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> x</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> Math.</span><span style="color:#B392F0">ceil</span><span style="color:#E1E4E8">(Math.</span><span style="color:#B392F0">random</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span><span style="color:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> const</span><span style="color:#79B8FF"> contents</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> </span></span>
<span class="line"><span style="color:#9ECBFF">\`# Dynamic math in markdown</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9ECBFF">Coding *dynamic* mathematical content</span></span>
<span class="line"><span style="color:#9ECBFF">...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9ECBFF">## Demo</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9ECBFF">This value &dollar; x=&dollar;{</span><span style="color:#E1E4E8">x</span><span style="color:#9ECBFF">} &dollar; and the following are generated dynamically:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9ECBFF">&dollar;&dollar; x^2 = &dollar;{<span style="color:#E1E4E8">x * x</span>} &dollar;&dollar;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9ECBFF">Reload the page to see new values.</span></span>
<span class="line"><span style="color:#9ECBFF">\`</span></span>
<span class="line"></span></code></pre>
\`\`\`
`;
