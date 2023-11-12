import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export class ValidationUtils {
  static isString(value: unknown): value is string {
    if (typeof value === "string") {
      return true;
    }
    return false;
  }

  static isNumber(value: unknown): value is number {
    if (typeof value === "number") {
      return true;
    }
    return false;
  }

  static isNonNegativeNumber(value: unknown): boolean {
    if (ValidationUtils.isString(value)) {
      return /^\d+$/.test(value);
    }
    return false;
  }

  static isNonNegativeHexOrNumberString(value: unknown): boolean {
    if (ValidationUtils.isString(value)) {
      return /^\d+$/.test(value) || ValidationUtils.isValidHex(value);
    }
    return false;
  }
  /**
   * Checks if the provided Ethereum timestamp is valid.
   * The Ethereum blockchain's genesis block is marked with a timestamp of 0,
   * which corresponds to the Unix epoch in 1970.
   * However, Ethereum was officially launched in 2015, making this timestamp, funny.
   * To consider valid Ethereum timestamps, we will accept from 2015, but we will also accept genesis.
   *
   * @param {number | null} timestamp - The Ethereum timestamp to check.
   * @returns {number | null} Returns the timestamp if it happened after 2015 Jan or is 0, otherwise returns null.
   */ static checkValidEVMTimestamp(timestamp: number | null): number | null {
    if (timestamp == null) {
      return null;
    }
    const ethereumLaunchYear = 1420070400; //Jan 1st 2015
    if (timestamp === 0) {
      return timestamp;
    }
    return timestamp >= ethereumLaunchYear ? timestamp : null;
  }

  static isValidHex(value: string, length?: number): boolean {
    const hexRegex = length
      ? new RegExp(`^0x[0-9a-fA-F]{${length}}$`)
      : /^0x[0-9a-fA-F]+$/;
    return typeof value === "string" && hexRegex.test(value);
  }
  //
  static hexOrNumberStringToNumber(value: string): number | null {
    if (ValidationUtils.isNonNegativeNumber(value)) {
      try {
        const timestamp = parseInt(value, 10);
        return timestamp >= 0 ? timestamp : null;
      } catch (error) {
        return null;
      }
    } else if (ValidationUtils.isValidHex(value)) {
      try {
        const timestamp = parseInt(value, 16);
        return timestamp;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }
}
