/**
 * @param {Polynomial|number} num
 * @param {(Polynomial|Expression)[]|Polynomial|Expression} linearFactors - linear factors of the denominator
 * @param {Polynomial|[Polynomial, 2]} [quadraticFactor] - either a perfect square or an irreducible quadratic factor in the denominator
 * @returns {{ working: string, answer: Expression, partialFractions: Expression[] }}
 */
export function partialFractions(num: Polynomial | number, linearFactors: (Polynomial | Expression)[] | Polynomial | Expression, quadraticFactor?: Polynomial | [Polynomial, 2] | undefined): {
    working: string;
    answer: Expression;
    partialFractions: Expression[];
};
import { Polynomial } from '../../core/polynomial/polynomial.js';
import { Expression } from '../../core/expression/expression.js';
//# sourceMappingURL=partial-fraction.d.ts.map