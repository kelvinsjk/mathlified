import { qns } from '../../src/lib/mathlified/__qns2-qns-src.ts';
import { contentHandler } from '../../src/lib/mathlified/content-handlers/qns';
import fs from 'fs-extra';
import path from 'path';

const preContent = `\\documentclass{exam}
\\usepackage{amsmath}
\\pointsinrightmargin
\\bracketedpoints
\\begin{document}
`;
const content = contentHandler(qns);
const postContent = `
\\end{document}`;

const tex = preContent + '\n' + content + '\n' + postContent;

fs.outputFileSync(path.resolve('./output/tex/qns2.tex'), tex);
