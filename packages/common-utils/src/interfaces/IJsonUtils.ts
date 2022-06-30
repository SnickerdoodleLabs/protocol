export interface IJsonUtils {
  safelyParseJSON<T>(json: string): T | null;
}

export const IJsonUtilsType = Symbol.for("IJsonUtils");
