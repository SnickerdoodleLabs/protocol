import { BigNumberString, DecimalString } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";

import { IBigNumberUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class BigNumberUtils implements IBigNumberUtils {
  protected oneBN = ethers.parseUnits("1", 18);
  constructor() {}

  public multiply(bn: bigint | BigNumberString, number: number): bigint {
    const bnForSure = BigInt(bn);
    const numberBN = ethers.parseUnits(number.toString(), 18);

    return (bnForSure * numberBN) / this.oneBN;
  }

  public divide(bn: bigint | BigNumberString, number: number): bigint {
    const bnForSure = BigInt(bn);
    const numberBN = ethers.parseUnits(number.toString(), 18);

    return (bnForSure * this.oneBN) / numberBN;
  }

  /* Conversion from decimal string to big number and big number string */
  public DSToBN(decimalString: DecimalString, decimals?: number): bigint {
    return ethers.parseUnits(decimalString, decimals || 18);
  }

  public DSToBNS(
    decimalString: DecimalString,
    decimals?: number,
  ): BigNumberString {
    return BigNumberString(
      ethers.parseUnits(decimalString, decimals || 18).toString(),
    );
  }
  /* End region of decimal string conversions */

  /* Conversion from big number to big number string and decimal string */
  public BNToBNS(bigint: bigint): BigNumberString {
    return BigNumberString(BigInt(bigint).toString());
  }

  public BNToDS(bigint: bigint, decimals?: number): DecimalString {
    return DecimalString(ethers.formatUnits(bigint, decimals || 18));
  }
  /* End region of big number conversions */

  /* Conversion from big number string to big number and decimal string */
  public BNSToBN(bigNumberString: BigNumberString): bigint {
    return BigInt(bigNumberString);
  }

  public BNSToDS(
    bigNumberString: BigNumberString,
    decimals?: number,
  ): DecimalString {
    const valueBigNumber = BigInt(bigNumberString);

    return DecimalString(ethers.formatUnits(valueBigNumber, decimals || 18));
  }
  /* End region of big number string conversions */

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
}
