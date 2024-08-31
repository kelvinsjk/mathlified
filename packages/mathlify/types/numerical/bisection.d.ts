/**
 * implementation of the bisection method for numerical root finding.
 *
 * @param {(x:number)=>number} f function
 * @param {number} lower lower bound (sign must be different at lower and upper)
 * @param {number} upper upper bound (sign must be different at lower and upper)
 * @param {number} [precision=5] number of digits after the decimal point to match before terminating
 */
export function bisection(f: (x: number) => number, lower: number, upper: number, precision?: number | undefined): number;
//# sourceMappingURL=bisection.d.ts.map