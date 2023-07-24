import { ResultAsync } from "neverthrow";

/**
 * This utility type adds parameters to the end of a function and returns the
 * new function type
 */
export type AddParameters<
  TFunction extends (...args: unknown[]) => unknown,
  TParameters extends [...args: unknown[]],
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

type AddParametersExample = AddParameters<
  () => void,
  [numParam: number, stringParam: string] // Note, this is how to use labels in a tuple!
>;
// equals (numParam: number, stringParam: string) => void

/**
 * This utility type returns the instantiated template type for the value of
 * a ResultAsync
 */
export type GetResultAsyncValueType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<infer T, unknown> ? T : unknown;

type GetResultAsyncValueTypeExample = GetResultAsyncValueType<
  ResultAsync<number, string>
>;
// equals number

/**
 * This utility type returns the instantiated template type for the error of
 * a ResultAsync
 */
export type GetResultAsyncErrorType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<unknown, infer T> ? T : unknown;

type GetResultAsyncErrorTypeExample = GetResultAsyncErrorType<
  ResultAsync<number, string>
>;
// equals string

// The following type utilities come from https://blog.e-mundo.de/post/typescript-tuple-trickery-utility-types-for-tuples/
// and https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type

/**
 * Returns a tuple type appended with a new element on the end
 */
export type AppendTuple<T extends unknown[], E> = [...T, E];

type AppendTupleExample = AppendTuple<[number, string], number>;
// equals [number, string, number]

/**
 * Returns a tuple type appended with a new element on the front
 */
export type PrependTuple<T extends unknown[], E> = [E, ...T];

type PrependTupleExample = PrependTuple<[number, string], number>;
// equals [number, number, string]

/**
 * Concatenates two tuples types into a single tuple
 */
export type ConcatTuple<T1 extends unknown[], T2 extends unknown[]> = [
  ...T1,
  ...T2,
];

type ConcatTupleExample = ConcatTuple<[number, string], [number, boolean]>;
// equals [number, string, number, boolean]

/**
 * Removes the first type in the tuple and returns the remaining elements
 */
export type ShiftTuple<T extends unknown[]> = T extends [T[0], ...infer R]
  ? R
  : never;

type ShiftTupleExample = ShiftTuple<[number, string, boolean]>;
// equals [string, boolean]

/**
 * Removes the last type in the tuple and returns the remaining elements
 */
export type PopTuple<T extends unknown[]> = T extends [...infer R, infer E]
  ? R
  : never;

type PopTupleExample = PopTuple<[number, string, boolean]>;
// equals [number, string]

/**
 * This bug is really annoying and seems to actually be in Typescript.
 * If the final parameter in a tuple is optional, then PopTuple breaks.
 * ...infer R, infer E does not match [number, string, boolean?] for some reason,
 * even if it does match [number, string, boolean | undefined]. So avoid
 * optional parameters for now.
 */
type PopTupleBugExample = PopTuple<[number, string, boolean?]>;
// equals never

export type FirstFromTuple<T extends unknown[]> = T["length"] extends 0
  ? undefined
  : T[0];

type FirstFromTupleExample = FirstFromTuple<[number, string, boolean]>;
// equals number

/**
 * Returns the last type in the tuple
 */
type LastFromTuple<T extends unknown[]> = T extends [...infer R, infer E]
  ? E
  : never;

type LastFromTupleExample = LastFromTuple<[number, string, boolean]>;
// equals boolean
