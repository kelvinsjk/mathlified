import type { ExtensionOptions } from '../index';
import glob from 'glob';
import dependencyTree from 'dependency-tree';
import fs from 'fs-extra';
import path from 'path';

export function trackFiles(exts: { [key: string]: ExtensionOptions }): {
	extList: string[];
	srcFiles: string[];
	depTree: Tree;
} {
	const extList = Object.keys(exts);
	const srcFiles = glob.sync(`./src/lib/mathlified/**/*.{${extList}}.{js,ts}`);
	const depTree = createReverseDependencyTree(srcFiles);
	return { extList, srcFiles, depTree };
}

/**
 * create a reverse dependency tree
 * to facilitate HMR
 */
function createReverseDependencyTree(files: string[]): Tree {
	const tree: Tree = {};
	files.forEach((file) => {
		file = path.resolve(file);
		const dependencyList = dependencyTree.toList({
			filename: file,
			directory: path.resolve('./src/lib/mathlified'),
		});
		dependencyList.forEach((dep) => {
			addBranch(tree, dep, file);
		});
	});
	return tree;
}

/**
 * on HMR, if new file is detected,
 * add it and its dependencies to the
 * dependent-tree
 */
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
		addBranch(tree, dep, file);
	});
	return tree;
}

/**
 * adds file as a dependent to
 * the dependency(dep) in the dependent-tree
 *
 * modified tree in place
 */
function addBranch(tree: Tree, dep: string, file: string): void {
	if (tree[dep] === undefined) {
		tree[dep] = new Set(file);
	} else {
		tree[dep].add(file);
	}
}

/**
 * a dependent tree (reverse of dependency tree)
 * key: path of file that we are tracking
 * tree[key]: set of paths of other files that rely on key as a dependency
 */
export interface Tree {
	[key: string]: Set<string>;
}
