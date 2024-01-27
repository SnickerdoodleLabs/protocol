import { BigNumberString, DecimalString } from "@snickerdoodlelabs/objects";

export interface IBigNumberUtils {
  multiply(bn: bigint | BigNumberString, number: number): bigint;
  divide(bn: bigint | BigNumberString, number: number): bigint;
  DSToBN(decimalString: DecimalString, decimals?: number): bigint;
  DSToBNS(decimalString: DecimalString, decimals?: number): BigNumberString;
  BNToBNS(bigint: bigint): BigNumberString;
  BNToDS(bigint: bigint, decimals?: number): DecimalString;
  BNSToBN(bigNumberString: BigNumberString): bigint;
  BNSToDS(bigNumberString: BigNumberString, decimals?: number): DecimalString;
  validateBNS(bigNumberString: string): boolean;
}

export const IBigNumberUtilsType = Symbol.for("IBigNumberUtils");
