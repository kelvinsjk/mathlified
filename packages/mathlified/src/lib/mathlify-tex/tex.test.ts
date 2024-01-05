import { mathlifyTex } from './index';
import { expect, test } from 'vitest';

const tex = mathlifyTex`
hello @${'world'}

$${'display'}

${'math1'}+${'math2'}${'math3'}x
${'\\frac'}{${'num'}}{den}
this paragraph started with math

this paragraph starts with text ${'math4'}+${'math5'}${'math6'}x

$${'display'}

Emphasis: @${'em{emphasized text}'}
@${'@br'}
Newline and bold: @${'b{bold text}'}
@${'@hr'}
Horizontal rule above
`;

test('tex: text,math,display', () => {
	expect(tex).toBe(`
hello world

$$ display $$

$math1+math2math3x$
$\\frac{num}{den}$
this paragraph started with math

this paragraph starts with text $math4+math5math6x$

$$ display $$

Emphasis: \\emph{emphasized text}
\\newline 
Newline and bold: \\textbf{bold text}
\\hrule 
Horizontal rule above
`);
});

test('tex: math envs', () => {
	const c = 3;
	const tex = mathlifyTex`
~${'equation'}
x+y=z

~${'align'}
x+y&=z
a+b&=c

~${'gather'}
x+y=z \\\\
a+b=c

~${'alignat{2}'}
x+y&=z & a+b&=c \\\\
x+y&=z & a+b&=${c}

~${'equation*'}
x+y=z

~${'align*'}
x+y&=z
a+b&=c

~${'gather*'}
x+y=z \\\\
a+b=c

~${'alignat*{2}'}
x+y&=z & a+b&=c \\\\
x+y&=z & a+b&=${c}
`;

	expect(tex).toBe(`
\\begin{equation}
x+y=z
\\end{equation}

\\begin{align}
x+y&=z
a+b&=c
\\end{align}

\\begin{gather}
x+y=z \\\\
a+b=c
\\end{gather}

\\begin{alignat}{2}
x+y&=z & a+b&=c \\\\
x+y&=z & a+b&=3
\\end{alignat}

\\begin{equation*}
x+y=z
\\end{equation*}

\\begin{align*}
x+y&=z
a+b&=c
\\end{align*}

\\begin{gather*}
x+y=z \\\\
a+b=c
\\end{gather*}

\\begin{alignat*}{2}
x+y&=z & a+b&=c \\\\
x+y&=z & a+b&=3

\\end{alignat*}`);
});
