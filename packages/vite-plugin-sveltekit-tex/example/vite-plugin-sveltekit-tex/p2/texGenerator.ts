import { post } from '../../src/lib/mathlified/__p2-post-src.ts';
import { contentHandler } from '../../src/lib/mathlified/content-handlers/post';
import fs from 'fs-extra';
import path from 'path';

const preContent = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}
`;
const content = contentHandler(post);
const postContent = `
\\end{document}`;

const tex = preContent + '\n' + content + '\n' + postContent;

fs.outputFileSync(path.resolve('./output/tex/p2.tex'), tex);
