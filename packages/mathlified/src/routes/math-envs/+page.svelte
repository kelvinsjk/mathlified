<script lang="ts">
	import { mathlify } from '$lib';

	const c = 3;
	const text = mathlify`
		equation
		~${'equation'}
		x+y=z

		Align

		~${'align'}
		2x+3y&=z \\\\
		a+b&=c

		Gather

		~${'gather'}
		2x+3y=z \\\\
		a+b=c

		alignat 

		~${'alignat{2}'}
		x+y&=z \\qquad & a+b&=c \\\\
		x+y&=z & a+b&=${c}

		eqn*

		~${'equation*'}
		x+y=z

		align*

		~${'align*'}
		2x+3y&=z \\\\
		a+b&=c

		gather*

		~${'gather*'}
		2x+3y=z \\\\
		a+b=c

		alignat*

		~${'alignat*{2}'}
		x+y&=z \\qquad & 2a+3b&=c \\\\
		x+y&=5z & a+b&=${c}
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
