/**
 * implementation of Simpson's 1/3 rule for numerical integration.
 *
 * @param {(x:number)=>number} f function to integrate
 * @param {number} lower lower bound of the integral
 * @param {number} upper upper bound of the integral
 * @param {number} [intervals=100] number of intervals (defaults to 100)
 * @returns {number} the numerical integral of f
 */
export function simpsons(f: (x: number) => number, lower: number, upper: number, intervals?: number | undefined): number;
//# sourceMappingURL=simpsons.d.ts.map