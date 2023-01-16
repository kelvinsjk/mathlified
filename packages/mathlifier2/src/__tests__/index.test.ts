import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
	math,
	display,
	newline,
	linebreak,
	strong,
	bold,
	em,
	emph,
	newParagraph,
	align,
	alignStar,
	gather,
	gatherStar,
	equation,
	eqn,
	equationStar,
	eqnStar,
	alignat,
	alignatStar,
} from '../index';

test('math', () => {
	assert.is(math('x'), `$\{x\}$`);
	assert.is(math('x', { wrap: true }), `$x$`);
});

test('display', () => {
	assert.is(display('x'), `$$x$$`);
});

test('environments', () => {
	assert.is(align('x &= 3'), '\\begin{align}\n\tx &= 3\n\\end{align}');
	assert.is(alignStar('x &= 3'), '\\begin{align*}\n\tx &= 3\n\\end{align*}');
	assert.is(gather('x = 3'), '\\begin{gather}\n\tx = 3\n\\end{gather}');
	assert.is(gatherStar('x = 3'), '\\begin{gather*}\n\tx = 3\n\\end{gather*}');
	assert.is(equation('x = 3'), '\\begin{equation}\n\tx = 3\n\\end{equation}');
	assert.is(equationStar('x = 3'), '\\begin{equation*}\n\tx = 3\n\\end{equation*}');
	assert.is(eqn('x = 3'), '\\begin{equation}\n\tx = 3\n\\end{equation}');
	assert.is(eqnStar('x = 3'), '\\begin{equation*}\n\tx = 3\n\\end{equation*}');
	assert.is(
		alignat('x &= 3 & y &= 2', 2),
		'\\begin{alignat}{2}\n\tx &= 3 & y &= 2\n\\end{alignat}',
	);
	assert.is(
		alignatStar('x &= 3 & y &= 2', 2),
		'\\begin{alignat*}{2}\n\tx &= 3 & y &= 2\n\\end{alignat*}',
	);
});

test('typesetting', () => {
	assert.is(`x.${newline}`, 'x.\\newline ');
	assert.is(`x.${linebreak}`, 'x.\\linebreak ');
	assert.is(strong('x'), '\\textbf{x}');
	assert.is(bold('x'), '\\textbf{x}');
	assert.is(em('x'), '\\emph{x}');
	assert.is(emph('x'), '\\emph{x}');
	assert.is(`Para 1.${newParagraph}Para 2.`, 'Para 1.\n\nPara 2.');
});

test.run();
