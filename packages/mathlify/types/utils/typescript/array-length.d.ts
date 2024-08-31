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
export function arrayHasLengthEqualTo<T extends readonly any[], L extends number>(arr: T, len: L): arr is T & LengthAtLeast<T, L>;
/**
 * <L,T>
 */
export type Indices<L extends number, T extends number[]> = T["length"] extends L ? T[number] : Indices<L, [T["length"], ...T]>;
/**
 * <T,L>
 */
export type LengthAtLeast<T extends readonly any[], L extends number> = Pick<Required<T>, Indices<L, []>>;
//# sourceMappingURL=array-length.d.ts.map