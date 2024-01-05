<script lang="ts">
	import { Polynomial } from 'mathlify';
	import { mathlify } from '$lib';

	const a = 3,
		b = 1,
		x0 = 2;
	const poly1 = new Polynomial([a, b]);
	const xSquare = new Polynomial([1, 0, 0]);
	const x1 = 5;
	const sign = b >= 0 ? '+' : '-';
	const working1 = `${a}(${x1}) ${sign} ${Math.abs(b)}`;
	const x2 = -1;

	const text = mathlify`
	Some functions are defined using different equations
	for different parts of their domain.
	These types of functions are known as
	@${'em{piecewise-defined functions}'}.
	For example, suppose we want to define a function ${'f'}
	with a domain that is the set of all real numbers such that 
	${`f(x) = ${poly1}`}
	for
	${`x \\geq ${x0}`}
	and
	${`f(x) = ${xSquare}`}
	for ${`x < ${x0}`}.
	We denote this function by writing

	$${`f(x) =`}
	\\begin{cases}
	${poly1} \\quad & x \\geq ${x0} \\\\
	${xSquare} \\quad & x < ${x0}
	\\end{cases}.


	

	When evaluating this function for an input ${'x'},
	the equation to use depends on whether 
	${`x \\geq ${x0}`}
	or
	${`x < ${x0}`}.
	For example, since ${`${x1} > ${x0}`},
	we use the fact that ${`f(x) = ${poly1}`}
	for
	${`x \\geq ${x0}`}
	and see that 
	${`f(${x1}) = ${working1} = ${poly1.subIn(x1)}`}.
	On the other hand, for
	${`x = ${x2}`},
	we use the fact that
	${`f(x) = ${xSquare}`}
	for	${`x < ${x0}`}
	and see that
	${`f(${x2}) = ${xSquare.subIn(x2)}`}.
	`;
</script>

<div>
	{@html text}
</div>

<footer>
	Text taken from Open Stax Calculus Volume 1 Section 1.1. Access for free at <a
		href="https://openstax.org/books/calculus-volume-1/pages/1-introduction">Open Stax</a
	>
</footer>

<style>
	div {
		max-width: 65ch;
		padding-inline: 1rem;
		line-height: 1.4375rem;
	}
</style>
