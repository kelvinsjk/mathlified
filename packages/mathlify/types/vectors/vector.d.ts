export class Vector {
    /**
     * @param {Shorthand} x
     * @param {Shorthand} [y=0]
     * @param {Shorthand} [z=0]
     */
    constructor(x: Shorthand, y?: import("../core/expression/expression.js").Shorthand | undefined, z?: import("../core/expression/expression.js").Shorthand | undefined);
    /** @type {Expression} */
    x: Expression;
    /** @type {Expression} */
    y: Expression;
    /** @type {Expression} */
    z: Expression;
    /**
     * @param {Vector} v
     * @returns {Expression}
     */
    dot(v: Vector): Expression;
    /**
     * @param {Vector} v
     * @returns {Vector}
     */
    cross(v: Vector): Vector;
    /**
     * @returns {Expression}
     */
    magnitude(): Expression;
    /**
     * @param {Vector} v
     * @returns {Vector}
     */
    plus(v: Vector): Vector;
    /**
     * Applies scalar multiplication
     * @param {Shorthand} k
     * @returns {Vector}
     */
    times(k: Shorthand): Vector;
    /**
     * @returns {Vector}
     */
    negative(): Vector;
    /**
     * @param {Vector} v
     * @returns {Vector}
     */
    minus(v: Vector): Vector;
    is: {
        /** @returns {boolean} */
        zero: () => boolean;
        /**
         * @param {Vector} v
         * @returns {boolean}
         */
        equalTo: (v: Vector) => boolean;
    };
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toIJKString(): string;
    /**
     * @param {string} [name='']
     * @returns {string}
     */
    toCoordinatesString(name?: string | undefined): string;
    /**
     * subs in variables for other expressions
     * @param {Record<string, Shorthand>} scope - variables to be replaced in the expression
     * @returns {Vector}
     */
    subIn(scope: Record<string, Shorthand>): Vector;
}
export type Shorthand = import("../core/expression/expression.js").Shorthand;
import { Expression } from '../core/expression/expression.js';
//# sourceMappingURL=vector.d.ts.map