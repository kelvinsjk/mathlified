import { Expression } from '../core/expression/expression.js';
import { greek } from '../utils/greek-variable.js';
import { Vector } from './vector.js';
import { vectorShorthandToVector } from './utils.js';
/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../core/expression/expression.js').Variable} Variable */
/** @typedef {import('./utils.js').VectorShorthand} VectorShorthand */

export class Line extends Vector {
	/** @typedef {Vector} */
	point;
	/** @typedef {Vector} */
	direction;
	/** @typedef {Variable} */
	parameter;
	/** @typedef {string} */
	name;

	/**
	 * defaults to using second argument as direction vector.
	 * Use the twoPointsMode option to use the second argument as a second point.
	 * @param {VectorShorthand} point
	 * @param {VectorShorthand} directionOrPt2
	 * @param {{parameter?: string|Variable, twoPointsMode?: boolean, name?: string}} [options]
	 */
	constructor(point, directionOrPt2, options) {
		const pt1 = vectorShorthandToVector(point);
		const arg2 = vectorShorthandToVector(directionOrPt2);
		// TODO: simplify direction vector by taking out common factors
		const direction = options?.twoPointsMode ? arg2.minus(pt1) : arg2;
		if (direction.is.zero())
			throw new Error('Direction vector cannot be the zero vector');
		const parameter = options?.parameter || greek('lambda');
		super(
			pt1.x.plus(new Expression(parameter).times(direction.x)),
			pt1.y.plus(new Expression(parameter).times(direction.y)),
			pt1.z.plus(new Expression(parameter).times(direction.z)),
		);
		this.point = pt1;
		this.direction = direction;
		this.parameter = parameter;
		this.name = options?.name || '';
	}

	/**
	 * @returns {string}
	 */
	toString() {
		const name = this.name ? `${this.name}: ` : '';
		return `${name}\\mathbf{r} = ${this.point} + ${this.parameter} ${this.direction}`;
	}
	/**
	 * @returns {string}
	 */
	toCartesianString() {
		if (`${this.direction.x}` === '0') {
			if (`${this.direction.y}` === '0') {
				// z assumed to be non-zero from constructor check on direction vector
				return `x = ${this.point.x}, y = ${this.point.y}, z \\in \\mathbb{R}`;
			} else if (`${this.direction.z}` === '0') {
				return `x = ${this.point.x}, z = ${this.point.z}, y \\in \\mathbb{R}`;
			}
			return `${toCartesianFragment(this, 'y')} = ${toCartesianFragment(this, 'z')}, x = ${this.point.x}`;
		} else if (`${this.direction.y}` === '0') {
			if (`${this.direction.z}` === '0') {
				return `y = ${this.point.y}, z = ${this.point.z}, x \\in \\mathbb{R}`;
			}
			return `${toCartesianFragment(this, 'x')} = ${toCartesianFragment(this, 'z')}, y = ${this.point.y}`;
		} else if (`${this.direction.z}` === '0') {
			return `${toCartesianFragment(this, 'x')} = ${toCartesianFragment(this, 'y')}, z = ${this.point.z}`;
		}
		return `${toCartesianFragment(this, 'x')} = ${toCartesianFragment(this, 'y')} = ${toCartesianFragment(this, 'z')}`;
	}
	/**
	 * @returns {string}
	 */
	toVectorString() {
		return super.toString();
	}
}

/**
 * @param {Line} line
 * @param {'x'|'y'|'z'} dimension
 * @returns {string}
 */
function toCartesianFragment(line, dimension) {
	const pt = line.point[dimension];
	const d = line.direction[dimension];
	const exp = new Expression([
		['+', dimension, pt.negative()],
		'/',
		d,
	]).simplify();
	return exp.toString();
}
