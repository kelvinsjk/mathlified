import { %ext% } from '%srcLocation%';
import { contentHandler } from '%handlerLocation%';
import fs from 'fs-extra';
import path from 'path';

const content = contentHandler(%ext%);

const tex = content;

fs.outputFileSync(path.resolve('./output/snippets%fileLocation%.snippet.tex'), tex);
