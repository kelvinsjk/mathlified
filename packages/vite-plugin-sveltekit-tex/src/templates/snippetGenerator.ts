import { %ext% } from '%srcLocation%';
import { contentHandler } from '%handlerLocation%';
import fs from 'fs';
import path from 'path';
import process from 'process';

const content = contentHandler(%ext%);

const tex = content;

outputFileSync(path.resolve('./output/snippets/%fileLocation%.snippet.tex'), tex);

// outputFileSync function taken/adapted from fs-extra
// https://github.com/jprichardson/node-fs-extra/blob/master/lib/output-file/index.js
// for purposes of texGenerator.ts
// MIT License
// Copyright (c) 2011-2017 JP Richardson
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function outputFileSync(file: string, data: string): void {
	const dir = path.dirname(file);
	if (fs.existsSync(dir)) {
		return fs.writeFileSync(file, data);
	}
	mkdirSync(dir);
	fs.writeFileSync(file, data);
}

// makeDirSync taken/adapted from fs-extra (see license and copyright above)
// https://github.com/jprichardson/node-fs-extra/blob/master/lib/mkdirs/make-dir.js
function mkdirSync(dir: string): string | undefined {
	checkPath(dir);
	return fs.mkdirSync(dir, {
		mode: 0o777,
		recursive: true,
	});
}

// checkPath taken/adapted from fs-extra,
// https://github.com/jprichardson/node-fs-extra/blob/master/lib/mkdirs/utils.js
// which is adapted from https://github.com/sindresorhus/make-dir
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function checkPath(pth: string) {
	if (process.platform === 'win32') {
		const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
			pth.replace(path.parse(pth).root, ''),
		);

		if (pathHasInvalidWinCharacters) {
			const error = new Error(`Path contains invalid characters: ${pth}`);
			error.code = 'EINVAL';
			throw error;
		}
	}
}