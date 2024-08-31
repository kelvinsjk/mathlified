/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('./utils.js').VectorShorthand} VectorShorthand */
/** @typedef {import('./vector.js').Vector} Vector */
/** @typedef {{rhs: Shorthand, name?: string}} PlaneVariant1 */
/** @typedef {{pt: VectorShorthand, name?: string}} PlaneVariant2 */
/** @typedef {{d1: VectorShorthand, d2: VectorShorthand, name?: string}} PlaneVariant3 */
/** @typedef {{d: VectorShorthand, pt2: VectorShorthand, name?: string}} PlaneVariant4 */
/** @typedef {{pt2: VectorShorthand, pt3: VectorShorthand, name?: string}} PlaneVariant5 */
export class Plane {
    /**
     * variant 1: given normal and rhs
     * variant 2: given normal and point
     * variant 3: given pt and two directions
     * variant 4: given 2 pts and 1 directions
     * variant 5: given 3 pts
     * @param {VectorShorthand} nOrPoint
     * @param {PlaneVariant1|PlaneVariant2|PlaneVariant3|PlaneVariant4|PlaneVariant5} options
     */
    constructor(nOrPoint: VectorShorthand, options: PlaneVariant1 | PlaneVariant2 | PlaneVariant3 | PlaneVariant4 | PlaneVariant5);
    /** @typedef {Vector} */
    normal: import("./vector.js").Vector;
    /** @typedef {Expression} */
    rhs: import("../core/expression/expression.js").Shorthand;
    /** @typedef {string} */
    name: string;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toCartesianString(): string;
}
export type Shorthand = import("../core/expression/expression.js").Shorthand;
export type VectorShorthand = import("./utils.js").VectorShorthand;
export type Vector = import("./vector.js").Vector;
export type PlaneVariant1 = {
    rhs: Shorthand;
    name?: string;
};
export type PlaneVariant2 = {
    pt: VectorShorthand;
    name?: string;
};
export type PlaneVariant3 = {
    d1: VectorShorthand;
    d2: VectorShorthand;
    name?: string;
};
export type PlaneVariant4 = {
    d: VectorShorthand;
    pt2: VectorShorthand;
    name?: string;
};
export type PlaneVariant5 = {
    pt2: VectorShorthand;
    pt3: VectorShorthand;
    name?: string;
};
//# sourceMappingURL=plane.d.ts.map