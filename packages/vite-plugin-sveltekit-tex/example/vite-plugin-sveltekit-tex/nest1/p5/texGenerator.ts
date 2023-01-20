import { qn } from '../../../src/lib/mathlified/nest1/__p5-qn-src.ts';
import { contentHandler } from '../../../src/lib/mathlified/content-handlers/qn';
import fs from 'fs-extra';
import path from 'path';

const preContent = `\\documentclass{exam}
\\usepackage{amsmath}
\\pointsinrightmargin
\\bracketedpoints
\\begin{document}
`;
const content = contentHandler(qn);
const postContent = `
\\end{document}`;

const tex = preContent + '\n' + content + '\n' + postContent;

fs.outputFileSync(path.resolve('./output/tex/nest1/p5.tex'), tex);
