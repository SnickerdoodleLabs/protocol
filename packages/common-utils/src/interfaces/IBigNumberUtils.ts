import {
  BigNumberString,
  DecimalString,
  HexString32,
} from "@snickerdoodlelabs/objects";

export interface IBigNumberUtils {
  //#region Math
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
  //#endregion Math
  //#region DST
  DSToBN(decimalString: DecimalString, decimals?: number): bigint;
  DSToBNS(decimalString: DecimalString, decimals?: number): BigNumberString;
  //#endregion DST
  //#region BN
  BNtoBuffer(bigint: bigint, byteLength: number): Buffer;
  BNToBNS(bigint: bigint): BigNumberString;
  BNToDS(bigint: bigint, decimals?: number): DecimalString;
  //#endregion BN
  //#region BNS
  BNStoBuffer(bigNumberString: BigNumberString, byteLength: number): Buffer;
  BNSToBN(bigNumberString: BigNumberString): bigint;
  BNSToDS(bigNumberString: BigNumberString, decimals?: number): DecimalString;
  BNStoHexString32(bigNumberString: BigNumberString): HexString32;
  BNStoHexString32NoPrefix(bigNumberString: BigNumberString): HexString32;
  //#endregion BNS
  //#region Buffer
  // note that the buffer is assumed to be in big-endian format
  bufferToBN(buffer: Buffer): bigint;
  bufferToBNS(buffer: Buffer): BigNumberString;
  //#endregion Buffer
  //#region HexString32
  HexString32NoPrefixToBN(hexString: HexString32): bigint;
  HexString32NoPrefixToBNS(hexString: HexString32): BigNumberString;
  //#endregion HexString32
  //#region Validation
  validateBNS(bigNumberString: string): boolean;
  //#endregion Validation
}

export const IBigNumberUtilsType = Symbol.for("IBigNumberUtils");
