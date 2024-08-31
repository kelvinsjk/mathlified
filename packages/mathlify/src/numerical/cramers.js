import { Expression } from '../core/expression/expression';
import { arrayHasLengthEqualTo } from '../utils/typescript/array-length';

/**
 * @overload
 * @param {[number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number]} coeffs2
 * @param {number} val2
 * @returns {[number,number]}
 */
/**
 * @overload
 * @param {[number,number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number,number]} coeffs2
 * @param {number} val2
 * @param {[number,number,number]} coeffs3
 * @param {number} val3
 * @returns {[number,number,number]}
 */
/**
 * @overload
 * @param {[number,number,number,number]} coeffs1
 * @param {number} val1
 * @param {[number,number,number,number]} coeffs2
 * @param {number} val2
 * @param {[number,number,number,number]} coeffs3
 * @param {number} val3
 * @param {[number,number,number,number]} coeffs4
 * @param {number} val4
 * @returns {[number,number,number,number]}
 */
/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]]
 * or to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 * @param {number[]} coeffs1
 * @param {number} val1
 * @param {number[]} coeffs2
 * @param {number} val2
 * @param {number[]} [coeffs3]
 * @param {number} [val3]
 * @param {number[]} [coeffs4]
 * @param {number} [val4]
 * @returns {number[]}
 */
export function cramers(
	coeffs1,
	val1,
	coeffs2,
	val2,
	coeffs3,
	val3,
	coeffs4,
	val4,
) {
	if (val3 && val4 && coeffs3 && coeffs4) {
		const det = determinant(...coeffs1, ...coeffs2, ...coeffs3, ...coeffs4);
		if (det === 0) {
			throw new Error('determinant 0: no roots found');
		}
		const detW = determinant(
			val1,
			...coeffs1.slice(1, 4),
			val2,
			...coeffs2.slice(1, 4),
			val3,
			...coeffs3.slice(1, 4),
			val4,
			...coeffs4.slice(1, 4),
		);
		const detX = determinant(
			...coeffs1.toSpliced(1, 1, val1),
			...coeffs2.toSpliced(1, 1, val2),
			...coeffs3.toSpliced(1, 1, val3),
			...coeffs4.toSpliced(1, 1, val4),
		);
		const detY = determinant(
			...coeffs1.toSpliced(2, 1, val1),
			...coeffs2.toSpliced(2, 1, val2),
			...coeffs3.toSpliced(2, 1, val3),
			...coeffs4.toSpliced(2, 1, val4),
		);
		const detZ = determinant(
			...coeffs1.slice(0, 3),
			val1,
			...coeffs2.slice(0, 3),
			val2,
			...coeffs3.slice(0, 3),
			val3,
			...coeffs4.slice(0, 3),
			val4,
		);
		return [detW / det, detX / det, detY / det, detZ / det];
	} else if (coeffs3 && val3) {
		const det = determinant(...coeffs1, ...coeffs2, ...coeffs3);
		if (det === 0) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinant(
			val1,
			...coeffs1.slice(1, 3),
			val2,
			...coeffs2.slice(1, 3),
			val3,
			...coeffs3.slice(1, 3),
		);
		const detY = determinant(
			...coeffs1.toSpliced(1, 1, val1),
			...coeffs2.toSpliced(1, 1, val2),
			...coeffs3.toSpliced(1, 1, val3),
		);
		const detZ = determinant(
			...coeffs1.slice(0, 2),
			val1,
			...coeffs2.slice(0, 2),
			val2,
			...coeffs3.slice(0, 2),
			val3,
		);
		return [detX / det, detY / det, detZ / det];
	} else if (
		arrayHasLengthEqualTo(coeffs1, 2) &&
		arrayHasLengthEqualTo(coeffs2, 2)
	) {
		const det = determinant(...coeffs1, ...coeffs2);
		if (det === 0) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinant(val1, coeffs1[1], val2, coeffs2[1]);
		const detY = determinant(coeffs1[0], val1, coeffs2[0], val2);
		return [detX / det, detY / det];
	}
	throw new Error('only 2x2, 3x3 or 4x4 equations are supported');
}

/**
 * @overload
 * @param {[number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @returns {[Expression,Expression]}
 */
/**
 * @overload
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @param {[number|Expression,number|Expression,number|Expression]} coeffs3
 * @param {number|Expression} val3
 * @returns {[Expression,Expression,Expression]}
 */
/**
 * @overload
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs1
 * @param {number|Expression} val1
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs2
 * @param {number|Expression} val2
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs3
 * @param {number|Expression} val3
 * @param {[number|Expression,number|Expression,number|Expression,number|Expression]} coeffs4
 * @param {number|Expression} val4
 * @returns {[Expression,Expression,Expression,Expression]}
 */
/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]]
 * or to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 * @param {(number|Expression)[]} coeffs1
 * @param {number|Expression} val1
 * @param {(number|Expression)[]} coeffs2
 * @param {number|Expression} val2
 * @param {(number|Expression)[]} [coeffs3]
 * @param {number|Expression} [val3]
 * @param {(number|Expression)[]} [coeffs4]
 * @param {number|Expression} [val4]
 * @returns {Expression[]}
 */
export function cramersFrac(
	coeffs1,
	val1,
	coeffs2,
	val2,
	coeffs3,
	val3,
	coeffs4,
	val4,
) {
	if (val3 && val4 && coeffs3 && coeffs4) {
		const det = determinantFrac(...coeffs1, ...coeffs2, ...coeffs3, ...coeffs4);
		if (det._getNumeral().is.zero()) {
			throw new Error('determinant 0: no roots found');
		}
		const detW = determinantFrac(
			val1,
			...coeffs1.slice(1, 4),
			val2,
			...coeffs2.slice(1, 4),
			val3,
			...coeffs3.slice(1, 4),
			val4,
			...coeffs4.slice(1, 4),
		);
		const detX = determinantFrac(
			...coeffs1.toSpliced(1, 1, val1),
			...coeffs2.toSpliced(1, 1, val2),
			...coeffs3.toSpliced(1, 1, val3),
			...coeffs4.toSpliced(1, 1, val4),
		);
		const detY = determinantFrac(
			...coeffs1.toSpliced(2, 1, val1),
			...coeffs2.toSpliced(2, 1, val2),
			...coeffs3.toSpliced(2, 1, val3),
			...coeffs4.toSpliced(2, 1, val4),
		);
		const detZ = determinantFrac(
			...coeffs1.slice(0, 3),
			val1,
			...coeffs2.slice(0, 3),
			val2,
			...coeffs3.slice(0, 3),
			val3,
			...coeffs4.slice(0, 3),
			val4,
		);
		return [
			detW.divide(det),
			detX.divide(det),
			detY.divide(det),
			detZ.divide(det),
		];
	} else if (coeffs3 && val3) {
		const det = determinantFrac(...coeffs1, ...coeffs2, ...coeffs3);
		console.log(`${det}`);
		if (det._getNumeral().is.zero()) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinantFrac(
			val1,
			...coeffs1.slice(1, 3),
			val2,
			...coeffs2.slice(1, 3),
			val3,
			...coeffs3.slice(1, 3),
		);
		const detY = determinantFrac(
			...coeffs1.toSpliced(1, 1, val1),
			...coeffs2.toSpliced(1, 1, val2),
			...coeffs3.toSpliced(1, 1, val3),
		);
		const detZ = determinantFrac(
			...coeffs1.slice(0, 2),
			val1,
			...coeffs2.slice(0, 2),
			val2,
			...coeffs3.slice(0, 2),
			val3,
		);
		return [detX.divide(det), detY.divide(det), detZ.divide(det)];
	} else if (
		arrayHasLengthEqualTo(coeffs1, 2) &&
		arrayHasLengthEqualTo(coeffs2, 2)
	) {
		const det = determinantFrac(...coeffs1, ...coeffs2);
		if (det._getNumeral().is.zero()) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinantFrac(val1, coeffs1[1], val2, coeffs2[1]);
		const detY = determinantFrac(coeffs1[0], val1, coeffs2[0], val2);
		return [detX.divide(det), detY.divide(det)];
	}
	throw new Error('only 2x2, 3x3 or 4x4 equations are supported');
}

/**
 * determinant of [[a b], [c d]] 2x2 matrix or [[a b c], [d e f], [g h i]] 3x3 matrix
 *
 * @param {number[]} args
 * @returns {number}
 */
function determinant(...args) {
	if (arrayHasLengthEqualTo(args, 4)) {
		return args[0] * args[3] - args[1] * args[2];
	} else if (arrayHasLengthEqualTo(args, 9)) {
		return (
			args[0] * determinant(args[4], args[5], args[7], args[8]) -
			args[1] * determinant(args[3], args[5], args[6], args[8]) +
			args[2] * determinant(args[3], args[4], args[6], args[7])
		);
	} else if (arrayHasLengthEqualTo(args, 16)) {
		const threeByThree1 =
			/** @type {[number, number, number, number, number, number, number, number, number]} */ ([
				...args.slice(1, 4),
				...args.slice(5, 8),
				...args.slice(9, 12),
			]);
		const a = args[12] * determinant(...threeByThree1);
		const threeByThree2 =
			/** @type {[number, number, number, number, number, number, number, number, number]} */ ([
				args[0],
				...args.slice(2, 5),
				...args.slice(6, 9),
				...args.slice(10, 12),
			]);
		const b = args[13] * determinant(...threeByThree2);
		const threeByThree3 =
			/** @type {[number, number, number, number, number, number, number, number, number]} */ ([
				...args.slice(0, 2),
				...args.slice(3, 6),
				...args.slice(7, 10),
				...args.slice(11, 12),
			]);
		const c = args[14] * determinant(...threeByThree3);
		const threeByThree4 =
			/** @type {[number, number, number, number, number, number, number, number, number]} */ ([
				...args.slice(0, 3),
				...args.slice(4, 7),
				...args.slice(8, 11),
			]);
		const d = args[15] * determinant(...threeByThree4);
		return -a + b - c + d;
	} else {
		throw new Error('determinant: only 2x2, 3x3 or 4x4 matrices supported');
	}
}

/**
 * determinant of [[a b], [c d]] 2x2 matrix or [[a b c], [d e f], [g h i]] 3x3 matrix
 *
 * @param {(number|Expression)[]} args
 * @returns {Expression}
 */
function determinantFrac(...args) {
	const argsExp = args.map((x) => new Expression(x));
	/**
	 * @param {Expression[]} args
	 * @param {number} index
	 * @returns {Expression}
	 */
	function typedGet(args, index) {
		return /** @type {Expression} */ (args[index]);
	}
	if (arrayHasLengthEqualTo(argsExp, 4)) {
		return typedGet(argsExp, 0)
			.times(typedGet(argsExp, 3))
			.minus(typedGet(argsExp, 1).times(typedGet(argsExp, 2)));
	} else if (arrayHasLengthEqualTo(argsExp, 9)) {
		return typedGet(argsExp, 0)
			.times(determinantFrac(argsExp[4], argsExp[5], argsExp[7], argsExp[8]))
			.minus(
				typedGet(argsExp, 1).times(
					determinantFrac(argsExp[3], argsExp[5], argsExp[6], argsExp[8]),
				),
			)
			.plus(
				typedGet(argsExp, 2).times(
					determinantFrac(argsExp[3], argsExp[4], argsExp[6], argsExp[7]),
				),
			);
	} else if (arrayHasLengthEqualTo(args, 16)) {
		const threeByThree1 =
			/** @type {[Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression]} */ ([
				...args.slice(1, 4),
				...args.slice(5, 8),
				...args.slice(9, 12),
			]);
		const a = typedGet(argsExp, 12).times(determinantFrac(...threeByThree1));
		const threeByThree2 =
			/** @type {[Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression]} */ ([
				args[0],
				...args.slice(2, 5),
				...args.slice(6, 9),
				...args.slice(10, 12),
			]);
		const b = typedGet(argsExp, 13).times(determinantFrac(...threeByThree2));
		const threeByThree3 =
			/** @type {[Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression]} */ ([
				...args.slice(0, 2),
				...args.slice(3, 6),
				...args.slice(7, 10),
				...args.slice(11, 12),
			]);
		const c = typedGet(argsExp, 14).times(determinantFrac(...threeByThree3));
		const threeByThree4 =
			/** @type {[Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression, Expression]} */ ([
				...args.slice(0, 3),
				...args.slice(4, 7),
				...args.slice(8, 11),
			]);
		const d = typedGet(argsExp, 15).times(determinantFrac(...threeByThree4));
		return a.negative().plus(b).minus(c).plus(d);
	} else {
		throw new Error('determinant: only 2x2 or 3x3 or 4x4 matrices supported');
	}
}
