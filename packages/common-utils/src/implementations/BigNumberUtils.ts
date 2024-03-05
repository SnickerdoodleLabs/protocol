import { BigNumberString, DecimalString } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";

import { IBigNumberUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class BigNumberUtils implements IBigNumberUtils {
  constructor() {}

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
  /* End region of decimal string conversions */

  /* Conversion from big number to big number string and decimal string */
  public BNToBNS(bigint: bigint): BigNumberString {
    return BigNumberString(BigInt(bigint).toString());
  }

  public BNToDS(bigNumber: bigint, decimals = 18): DecimalString {
    return DecimalString(ethers.formatUnits(bigNumber, decimals || 18));
  }
  /* End region of big number conversions */

  /* Conversion from big number string to big number and decimal string */
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
