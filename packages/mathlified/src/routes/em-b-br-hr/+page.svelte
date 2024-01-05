<script lang="ts">
	import { mathlify } from '$lib';

	const text = mathlify`
		This is @${'b{bold}'} and this is
		@${'em{italic}'}.
		@${'@br'}
		This starts on a new line
		@${'@hr'}
		And this is after a horizontal rule.
	`;
</script>

<div>
	{@html text}
</div>

<style>
	div {
		max-width: 65ch;
		padding-inline: 1rem;
		line-height: 1.4375rem;
	}
</style>
