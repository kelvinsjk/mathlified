export namespace integrate {
    function standard(exp: import("../../index.js").Shorthand, variable?: string | import("../../index.js").Variable | undefined, options?: {
        c?: true | number | Numeral | string;
        absolute?: boolean;
    } | undefined): Expression;
    function byParts(exp: Expression, variable?: string | undefined, options?: {
        c?: true | number | Numeral | string;
    } | undefined): Expression;
}
export type Numeral = import("../../core/expression/expression.js").Numeral;
export type Variable = import("../../core/expression/expression.js").Variable;
import { Expression } from '../../core/expression/expression.js';
//# sourceMappingURL=integrate.d.ts.map