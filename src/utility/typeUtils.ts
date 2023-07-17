type IsArray<T> = T extends Array<unknown> ? (Array<unknown> extends T ? true : false) : false;

type IsObject<T> = T extends object ? (IsArray<T> extends true ? false : true) : false;

/**
 * Converts a union type to an intersection type.
 *
 * @see https://stackoverflow.com/a/50375286/11621047
 */
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/**
 * Converts a union type to a combined object type.
 *
 * @see https://stackoverflow.com/a/50375286/11621047
 */
type Combine<U> = UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Converts a type to a flattened representation of its leaf nodes.
 *
 * The flattened representation is a union of all fields in the object and in any nested objects,
 * with the keys being dot-separated paths to the leaf node type.
 *
 * @example
 * interface Foo {
 *   a: string;
 *   b: {
 *     c: number;
 *   };
 * }
 *
 * type Result = Leaves<'', Foo>;
 * // `Result` has the following type:
 * // {a: string} | {'b.c': number}
 */
type Leaves<A extends string, T> = [keyof T] extends [infer K]
	? K extends keyof T
		? IsObject<T[K]> extends true
			? Leaves<`${A}${Exclude<K, symbol>}.`, T[K]>
			: { [L in `${A}${Exclude<K, symbol>}`]: T[K] }
		: never
	: never;

/**
 * Flattens an object and all its nested objects into a single one,
 * where each key is a dot-separated path to a leaf node.
 *
 * @example
 * interface Foo {
 *   a: string;
 *   b: {
 *     c: number;
 *   };
 * }
 *
 * type Result = Flatten<Foo>;
 * // `Result` has the following type:
 * // {a: string; 'b.c': number}
 */
export type Flatten<T> = Combine<Leaves<'', T>>;

/**
 * Makes all properties of an object readonly, recursively.
 */
export type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };
