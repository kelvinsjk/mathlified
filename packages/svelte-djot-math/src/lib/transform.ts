export function transform(x: string): string {
	return x
		.replace(
			/(?<![\\`])\$\$(?!`)([^]+?)\$\$(?!`)/g,
			(_, match) => `$$\`${match.replaceAll('\\_', '_')}\``
		)
		.replace(
			/(?<![\\`$])\$(?!`)(.+?)(?<!\\)\$(?![`$])/g,
			(_, match) => `$\`${match.replaceAll('\\_', '_')}\``
		)
		.replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`');
}
