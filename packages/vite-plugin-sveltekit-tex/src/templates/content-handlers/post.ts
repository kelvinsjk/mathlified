export interface Post {
	title?: string;
	body: string;
}

export function contentHandler(post: Post): string {
	return post.body;
}
