export interface IErrorUtils {
  emit<T extends Error>(error: T): void;
}

export const IErrorUtilsType = Symbol.for("IErrorUtils");
