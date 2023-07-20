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

/**
 * This utility type returns the instantiated template type for the value of
 * a ResultAsync
 */
export type GetResultAsyncValueType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<infer T, unknown> ? T : unknown;

/**
 * This utility type returns the instantiated template type for the error of
 * a ResultAsync
 */
export type GetResultAsyncErrorType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<unknown, infer T> ? T : unknown;
