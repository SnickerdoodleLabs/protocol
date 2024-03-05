/**
 * Extracts properties from an object, ensuring it conforms to a specified type.
 */
export const extractObject = <T>(source: Record<string, any> & T): T => {
  const result = {} as T;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key as keyof T] = source[key];
    }
  }

  return result;
};
