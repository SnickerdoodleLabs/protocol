import {
  BigNumberString,
  DecimalString,
  HexString32,
} from "@snickerdoodlelabs/objects";

export interface IBigNumberUtils {
  multiply(
    bn: bigint | BigNumberString,
    number: number,
    decimals?: number,
  ): bigint;
  divide(
    bn: bigint | BigNumberString,
    number: number,
    decimals?: number,
  ): bigint;
  DSToBN(decimalString: DecimalString, decimals?: number): bigint;
  DSToBNS(decimalString: DecimalString, decimals?: number): BigNumberString;
  BNToBNS(bigint: bigint): BigNumberString;
  BNToDS(bigint: bigint, decimals?: number): DecimalString;
  BNSToBN(bigNumberString: BigNumberString): bigint;
  BNSToDS(bigNumberString: BigNumberString, decimals?: number): DecimalString;
  validateBNS(bigNumberString: string): boolean;
  BNStoHexString32(bigNumberString: BigNumberString): HexString32;
  BNStoHexString32NoPrefix(bigNumberString: BigNumberString): HexString32;
  HexString32NoPrefixToBNS(hexString: HexString32): BigNumberString;
}

export const IBigNumberUtilsType = Symbol.for("IBigNumberUtils");
