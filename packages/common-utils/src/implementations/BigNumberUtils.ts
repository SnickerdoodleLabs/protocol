import {
  BigNumberString,
  DecimalString,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { fromString, toString } from "uint8arrays";

import { IBigNumberUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class BigNumberUtils implements IBigNumberUtils {
  constructor() {}

  //#region Math
  public multiply(
    bn: bigint | BigNumberString,
    number: number,
    decimals = 18,
  ): bigint {
    const bnForSure = BigInt(bn);
    const multiplierBN = ethers.parseUnits(number.toString(), decimals);
    const oneBN = ethers.parseUnits("1", decimals);

    return (bnForSure * multiplierBN) / oneBN;
  }

  public divide(
    bn: bigint | BigNumberString,
    number: number,
    decimals = 18,
  ): bigint {
    const bnForSure = BigInt(bn);
    const divisorBN = ethers.parseUnits(number.toString(), decimals);
    const oneBN = ethers.parseUnits("1", decimals);

    return (bnForSure * oneBN) / divisorBN;
  }
  //#endregion Math

  //#region DST
  /* Conversion from decimal string to big number and big number string */
  public DSToBN(decimalString: DecimalString, decimals = 18): bigint {
    return ethers.parseUnits(decimalString, decimals);
  }

  public DSToBNS(
    decimalString: DecimalString,
    decimals?: number,
  ): BigNumberString {
    return BigNumberString(
      ethers.parseUnits(decimalString, decimals).toString(),
    );
  }
  //#endregion DST

  //#region BN
  /* Conversion from big number to big number string and decimal string */
  public BNtoBuffer(bigint: bigint): Buffer {
    const uint8Array = this.BNtoUint8Array(bigint);
    // Create a buffer from the Uint8Array in place
    //	 if we don't specify the byteOffset and byteLength we will copy data
    return Buffer.from(
      uint8Array,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
  }

  public BNToBNS(bigint: bigint): BigNumberString {
    return BigNumberString(BigInt(bigint).toString());
  }

  public BNToDS(bigNumber: bigint, decimals = 18): DecimalString {
    return DecimalString(ethers.formatUnits(bigNumber, decimals || 18));
  }

  public BNtoUint8Array(bigint: bigint): Uint8Array {
    let hexString = bigint.toString(16);
    // Ensure the hex string takes the required number of bytes
    //    each byte is represented by 2 hex characters
    //    so we need 16 bytes * 2 hex characters = 32 hex characters
    const requiredLength = 32;
    while (hexString.length < requiredLength) {
      hexString = "0" + hexString;
    }
    return fromString(hexString, "base16");
  }
  //#endregion BN

  //#region BNS
  /* Conversion from big number string to big number and decimal string */
  public BNStoBuffer(bigNumberString: BigNumberString): Buffer {
    return this.BNtoBuffer(this.BNSToBN(bigNumberString));
  }

  public BNSToBN(bigNumberString: BigNumberString): bigint {
    return BigInt(bigNumberString);
  }

  public BNSToDS(
    bigNumberString: BigNumberString,
    decimals = 18,
  ): DecimalString {
    const valueBigNumber = BigInt(bigNumberString);

    return DecimalString(ethers.formatUnits(valueBigNumber, decimals || 18));
  }

  public BNStoHexString32(bigNumberString: BigNumberString): HexString32 {
    return HexString32(ethers.toBeHex(this.BNSToBN(bigNumberString), 32));
  }

  public BNStoHexString32NoPrefix(
    bigNumberString: BigNumberString,
  ): HexString32 {
    return HexString32(this.BNStoHexString32(bigNumberString).substring(2));
  }

  public BNStoUint8Array(bigNumberString: BigNumberString): Uint8Array {
    return this.BNtoUint8Array(this.BNSToBN(bigNumberString));
  }
  //#endregion BNS

  //#region Bytes
  public bufferToBN(buffer: Buffer): bigint {
    const hexString = HexString32(buffer.toString("hex"));
    return this.HexString32NoPrefixToBN(hexString);
  }

  public bufferToBNS(buffer: Buffer): BigNumberString {
    const hexString = HexString32(buffer.toString("hex"));
    return this.HexString32NoPrefixToBNS(hexString);
  }

  public uint8ArrayToBN(uint8Array: Uint8Array): bigint {
    const hexString = HexString32(toString(uint8Array, "base16"));
    return this.HexString32NoPrefixToBN(hexString);
  }

  public uint8ArrayToBNS(uint8Array: Uint8Array): BigNumberString {
    const hexString = HexString32(toString(uint8Array, "base16"));
    return this.HexString32NoPrefixToBNS(hexString);
  }
  //#endregion Bytes

  //#region HexString32
  public HexString32NoPrefixToBN(hexString: HexString32): bigint {
    return BigInt(`0x${hexString}`);
  }
  public HexString32NoPrefixToBNS(hexString: HexString32): BigNumberString {
    return BigNumberString(this.HexString32NoPrefixToBN(hexString).toString());
  }
  //#endregion HexString32

  //#region Validation
  /**
   * This method returns true if the bigNumberString is a
   * @param bigNumberString
   * @returns true if bigNumberString is a valid bigint
   */
  public validateBNS(bigNumberString: string): boolean {
    try {
      BigInt(bigNumberString);
      return true;
    } catch (e) {
      return false;
    }
  }
  //#endregion Validation
}
