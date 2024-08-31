export interface NavNode {
	name: string;
	slug: string;
	fileSlug: string;
	children?: NavNode[];
}
