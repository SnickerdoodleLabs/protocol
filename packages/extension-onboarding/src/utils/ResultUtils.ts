import { ResultAsync } from "neverthrow";

export const convertToSafePromise = <T, K>(
  fn: ResultAsync<T, K>,
): Promise<T> => {
  return fn.unwrapOr(null as unknown as T);
};
