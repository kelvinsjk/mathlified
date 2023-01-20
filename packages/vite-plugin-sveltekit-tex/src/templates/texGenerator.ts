import { %ext% } from '%srcLocation%';
import { contentHandler } from '%handlerLocation%';
import fs from 'fs-extra';
import path from 'path';

const preContent = `%preContent%`;
const content = contentHandler(%ext%);
const postContent = `%postContent%`;

const tex = preContent + '\n' + content + '\n' + postContent;

fs.outputFileSync(path.resolve('./output/tex%fileLocation%.tex'), tex);
