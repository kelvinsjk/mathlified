// code modified from jcalz's answer on StackOverflow
// https://stackoverflow.com/questions/69368851/type-safe-way-of-narrowing-type-of-arrays-by-length-when-nouncheckedindexedacces

// TODO: handle differences between LengthAtLeast and LengthEqualTo

/**
 * @typedef { T['length'] extends L ? T[number] : Indices<L, [T['length'], ...T]>} Indices<L,T>
 * @template {number} L
 * @template {number[]} T
 */
/**
 * @typedef {Pick<Required<T>,Indices<L,[]>>} LengthAtLeast<T,L>
 * @template {readonly any[]} T
 * @template {number} L
 */
/**
 * @param {T} arr
 * @param {L} len
 * @template {readonly any[]} T
 * @template {number} L
 * @returns {arr is T & LengthAtLeast<T,L>}
 */
export function arrayHasLengthEqualTo(arr, len) {
	return arr.length === len;
}
