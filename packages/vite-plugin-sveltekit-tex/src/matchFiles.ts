import path from 'path';

export function mathlifiedDir(): string {
	return path.resolve('./src/lib/mathlified');
}
export function matchFile(
	file: string,
	extList: string[],
): [true, string, string] | [false] {
	for (const extName of extList) {
		const extMatch = file.match(new RegExp(`${mathlifiedDir()}(.+).${extName}.[t|j]s`));
		if (extMatch) {
			return [true, extMatch[1], extName];
		}
	}
	return [false];
}

export function matchTex(file: string): [true, string] | [false] {
	const extMatch = file.match(new RegExp(`${mathlifiedDir()}(.+).mathlified.tex`));
	if (extMatch) {
		return [true, extMatch[1]];
	}
	return [false];
}
