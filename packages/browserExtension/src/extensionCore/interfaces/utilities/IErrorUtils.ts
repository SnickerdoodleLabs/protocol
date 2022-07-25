export interface IErrorUtils {
  emit<T extends Error>(error: T): void;
}
