import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export class ValidationUtils {
  static isString(value: unknown): boolean {
    if (typeof value === "string") {
      return true;
    }
    return false;
  }

  static isNumber(value: unknown): boolean {
    if (typeof value === "number") {
      return true;
    }
    return false;
  }

  static isNonNegativeNumberString(value: string): boolean {
    if (typeof value === "string") {
      return /^\d+$/.test(value);
    }
    return false;
  }

  static isHexString(value: string): boolean {
    if (typeof value === "string") {
      const hexRegex = /^0x[0-9a-fA-F]+$/;
      return hexRegex.test(value);
    }
    return false;
  }
}
