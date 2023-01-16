import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
	math,
	display,
	equation,
	eqn,
	equationStar,
	eqnStar,
	align,
	alignStar,
	gather,
	gatherStar,
	alignat,
	alignatStar,
	newline,
	linebreak,
	strong,
	bold,
	emph,
	em,
	newParagraph,
} from '../index';

test('math', () => {
	assert.is(
		math('x'),
		`<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">{x}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord"><span class="mord mathnormal">x</span></span></span></span></span>`,
	);
	assert.is(
		math('x', { wrap: true }),
		`<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span>`,
	);
});

test('display', () => {
	assert.is(
		display('x'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span></div>`,
	);
	assert.is(
		display('x', { overflowAuto: false }),
		`<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span></span>`,
	);
});

test('typesetting', () => {
	assert.is(linebreak, '<br>');
	assert.is(newline, '<br>');
	assert.is(strong('x'), '<strong>x</strong>');
	assert.is(bold('x'), '<strong>x</strong>');
	assert.is(em('x'), '<em>x</em>');
	assert.is(emph('x'), '<em>x</em>');
	assert.is(newParagraph, '<p>');
});

test('environments', () => {
	assert.is(
		align('x &= 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd class ="mtr-glue"></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>x</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd class ="mtr-glue"></mtd><mtd class ="mml-eqn-num"></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{align}
    x &amp;= 3
  \\end{align}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span><span class="tag"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3em;"><span class="pstrut" style="height:2.84em;"></span><span class="eqn-num"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		alignStar('x &= 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>x</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>3</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{align*}
    x &amp;= 3
  \\end{align*}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		equationStar('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.16em" columnspacing="1em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{equation*}
    x = 3
  \\end{equation*}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2em;vertical-align:-0.35em;"></span><span class="mord"><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-3.01em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		eqnStar('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.16em" columnspacing="1em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{equation*}
    x = 3
  \\end{equation*}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2em;vertical-align:-0.35em;"></span><span class="mord"><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-3.01em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		eqn('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.16em" columnspacing="1em"><mtr><mtd class ="mtr-glue"></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd class ="mtr-glue"></mtd><mtd class ="mml-eqn-num"></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{equation}
    x = 3
  \\end{equation}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2em;vertical-align:-0.35em;"></span><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-3.01em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span><span class="tag"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:2.84em;"></span><span class="eqn-num"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		equation('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.16em" columnspacing="1em"><mtr><mtd class ="mtr-glue"></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd class ="mtr-glue"></mtd><mtd class ="mml-eqn-num"></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{equation}
    x = 3
  \\end{equation}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.2em;vertical-align:-0.35em;"></span><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-3.01em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span><span class="tag"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.85em;"><span style="top:-2.85em;"><span class="pstrut" style="height:2.84em;"></span><span class="eqn-num"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.35em;"><span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		gather('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="center" columnspacing="0em"><mtr><mtd class ="mtr-glue"></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd class ="mtr-glue"></mtd><mtd class ="mml-eqn-num"></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{gather}
    x = 3
  \\end{gather}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span><span class="tag"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3em;"><span class="pstrut" style="height:2.84em;"></span><span class="eqn-num"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		gatherStar('x = 3'),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="center" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi>x</mi><mo>=</mo><mn>3</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{gather*}
    x = 3
  \\end{gather*}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mord"><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		alignatStar('x &= 3 & y &= 4', 2),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>x</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>y</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>4</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{alignat*}{2}
    x &amp;= 3 &amp; y &amp;= 4
  \\end{alignat*}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">4</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></span></span></span></div>`,
	);
	assert.is(
		alignat('x &= 3 & y &= 4', 2),
		`<div style="overflow-x:auto;" class="mathlifier-display"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left right left" columnspacing="0em"><mtr><mtd class ="mtr-glue"></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>x</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>3</mn></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mi>y</mi></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo>=</mo><mn>4</mn></mrow></mstyle></mtd><mtd class ="mtr-glue"></mtd><mtd class ="mml-eqn-num"></mtd></mtr></mtable><annotation encoding="application/x-tex">\\begin{alignat}{2}
    x &amp;= 3 &amp; y &amp;= 4
  \\end{alignat}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.5em;vertical-align:-0.5em;"></span><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">x</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3.16em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">4</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span><span class="tag"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1em;"><span style="top:-3em;"><span class="pstrut" style="height:2.84em;"></span><span class="eqn-num"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.5em;"><span></span></span></span></span></span></span></span></span></div>`,
	);
});

test.run();
