/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('../core/expression/expression.js').Variable} Variable */
/** @typedef {import('./utils.js').VectorShorthand} VectorShorthand */
export class Line extends Vector {
    /**
     * defaults to using second argument as direction vector.
     * Use the twoPointsMode option to use the second argument as a second point.
     * @param {VectorShorthand} point
     * @param {VectorShorthand} directionOrPt2
     * @param {{parameter?: string|Variable, twoPointsMode?: boolean, name?: string}} [options]
     */
    constructor(point: VectorShorthand, directionOrPt2: VectorShorthand, options?: {
        parameter?: string | Variable;
        twoPointsMode?: boolean;
        name?: string;
    } | undefined);
    /** @typedef {Vector} */
    point: Vector;
    /** @typedef {Vector} */
    direction: Vector;
    /** @typedef {Variable} */
    parameter: string | import("../core/expression/expression.js").Variable;
    /** @typedef {string} */
    name: string;
    /**
     * @returns {string}
     */
    toCartesianString(): string;
    /**
     * @returns {string}
     */
    toVectorString(): string;
}
export type Shorthand = import("../core/expression/expression.js").Shorthand;
export type Variable = import("../core/expression/expression.js").Variable;
export type VectorShorthand = import("./utils.js").VectorShorthand;
import { Vector } from './vector.js';
//# sourceMappingURL=line.d.ts.map