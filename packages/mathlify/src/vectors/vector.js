/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
import { Expression } from '../core/expression/expression.js';
import { Sqrt } from '../fns/index';

export class Vector {
	/** @type {Expression} */
	x;
	/** @type {Expression} */
	y;
	/** @type {Expression} */
	z;

	/**
	 * @param {Shorthand} x
	 * @param {Shorthand} [y=0]
	 * @param {Shorthand} [z=0]
	 */
	constructor(x, y = 0, z = 0) {
		this.x = new Expression(x);
		this.y = new Expression(y);
		this.z = new Expression(z);
	}

	/**
	 * @param {Vector} v
	 * @returns {Expression}
	 */
	dot(v) {
		return this.x.times(v.x).plus(this.y.times(v.y)).plus(this.z.times(v.z));
	}

	/**
	 * @param {Vector} v
	 * @returns {Vector}
	 */
	cross(v) {
		return new Vector(
			this.y.times(v.z).minus(this.z.times(v.y)),
			this.z.times(v.x).minus(this.x.times(v.z)),
			this.x.times(v.y).minus(this.y.times(v.x)),
		);
	}

	/**
	 * @returns {Expression}
	 */
	magnitude() {
		return new Expression(new Sqrt(this.dot(this)));
	}

	/**
	 * @param {Vector} v
	 * @returns {Vector}
	 */
	plus(v) {
		return new Vector(this.x.plus(v.x), this.y.plus(v.y), this.z.plus(v.z));
	}
	/**
	 * Applies scalar multiplication
	 * @param {Shorthand} k
	 * @returns {Vector}
	 */
	times(k) {
		return new Vector(this.x.times(k), this.y.times(k), this.z.times(k));
	}
	/**
	 * @returns {Vector}
	 */
	negative() {
		return new Vector(this.x.negative(), this.y.negative(), this.z.negative());
	}
	/**
	 * @param {Vector} v
	 * @returns {Vector}
	 */
	minus(v) {
		return this.plus(v.negative());
	}

	is = {
		/** @returns {boolean} */
		zero: () =>
			`${this.x}` === '0' && `${this.y}` === '0' && `${this.z}` === '0',
		/**
		 * @param {Vector} v
		 * @returns {boolean}
		 */
		equalTo: (v) => this.minus(v).is.zero(),
	};

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\begin{pmatrix}\n\t${this.x}\\\\\n\t${this.y}\\\\\n\t${this.z}\n\\end{pmatrix}`;
	}
	/**
	 * @returns {string}
	 */
	toIJKString() {
		const exp = new Expression([
			'+',
			[this.x, '\\mathbf{i}'],
			[this.y, '\\mathbf{j}'],
			[this.z, '\\mathbf{k}'],
		]).simplify();
		return exp.toString();
	}
	/**
	 * @param {string} [name='']
	 * @returns {string}
	 */
	toCoordinatesString(name = '') {
		return `${name}\\left( ${this.x}, ${this.y}, ${this.z} \\right)`;
	}

	/**
	 * subs in variables for other expressions
	 * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
	 * @returns {Vector}
	 */
	subIn(scope) {
		return new Vector(
			this.x.subIn(scope),
			this.y.subIn(scope),
			this.z.subIn(scope),
		);
	}
}
