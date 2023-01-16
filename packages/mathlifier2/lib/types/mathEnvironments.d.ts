/**
 * Renders align environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function align(x: string, options?: any): string;
/**
 * Renders align* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function alignStar(x: string, options?: any): string;
/**
 * Renders alignat environment
 *
 * @param x TeX expression to be rendered
 * @param pairs number of r/l column pairs
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function alignat(x: string, pairs: number, options?: any): string;
/**
 * Renders alignat* environment
 *
 * @param x TeX expression to be rendered
 * @param pairs number of r/l column pairs
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function alignatStar(x: string, pairs: number, options?: any): string;
/**
 * Renders gather environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function gather(x: string, options?: any): string;
/**
 * Renders gather* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function gatherStar(x: string, options?: any): string;
/**
 * Renders equation* environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function equationStar(x: string, options?: any): string;
/**
 * Renders equation environment
 *
 * @param x TeX expression to be rendered
 * @param options will be ignored. This is only for compatibility with the "mathlifier" library
 *
 */
export declare function equation(x: string, options?: any): string;
export declare const eqn: typeof equation;
export declare const eqnStar: typeof equationStar;
