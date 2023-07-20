import { ResultAsync } from "neverthrow";

export type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any],
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

export type GetResultAsyncValueType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<infer T, unknown> ? T : unknown;

export type GetResultAsyncErrorType<C extends ResultAsync<unknown, unknown>> =
  C extends ResultAsync<unknown, infer T> ? T : unknown;
