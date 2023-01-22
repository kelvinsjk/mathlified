import dependencyTree from 'dependency-tree';
import fs from 'fs-extra';
import path from 'path';

/**
 * create a reverse dependency tree
 * to facilitate HMR
 */
export function createReverseDependencyTree(files: string[]): Tree {
	const tree: Tree = {};
	files.forEach((file) => {
		file = path.resolve(file);
		const dependencyList = dependencyTree.toList({
			filename: file,
			directory: path.resolve('./src/lib/mathlified'),
		});
		dependencyList.forEach((dep) => {
			if (tree[dep] === undefined) {
				tree[dep] = [file];
			} else {
				if (!tree[dep].includes(file)) {
					tree[dep].push(file);
				}
			}
		});
	});
	return tree;
}

export async function appendToTree(
	tree: Tree,
	file: string,
	read: () => string | Promise<string>,
): Promise<Tree> {
	const data = await read();
	const duplicatePath = path.resolve(file, `../__${path.parse(file).name}-src.ts`);
	fs.outputFileSync(duplicatePath, data);
	const dependencyList = dependencyTree.toList({
		filename: duplicatePath,
		directory: path.resolve('./src/lib/mathlified'),
	});
	dependencyList.forEach((dep) => {
		if (dep === duplicatePath) {
			dep = file;
		}
		if (tree[dep] === undefined) {
			tree[dep] = [file];
		} else {
			if (!tree[dep].includes(file)) {
				tree[dep].push(file);
			}
		}
	});
	return tree;
}

interface Tree {
	[key: string]: string[];
}
