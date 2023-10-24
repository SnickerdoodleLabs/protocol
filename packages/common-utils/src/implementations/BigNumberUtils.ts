import { BigNumberString, DecimalString } from "@snickerdoodlelabs/objects";
import { BigNumber, utils } from "ethers";
import { injectable } from "inversify";

import { IBigNumberUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class BigNumberUtils implements IBigNumberUtils {
  protected oneBN: BigNumber = utils.parseUnits("1", 18);
  constructor() {}

  public multiply(bn: BigNumber | BigNumberString, number: number): BigNumber {
    const bnForSure = BigNumber.from(bn);
    const numberBN = utils.parseUnits(number.toString(), 18);

    return bnForSure.mul(numberBN).div(this.oneBN);
  }

  public divide(bn: BigNumber | BigNumberString, number: number): BigNumber {
    const bnForSure = BigNumber.from(bn);
    const numberBN = utils.parseUnits(number.toString(), 18);

    return bnForSure.mul(this.oneBN).div(numberBN);
  }

  /* Conversion from decimal string to big number and big number string */
  public DSToBN(decimalString: DecimalString, decimals?: number): BigNumber {
    return utils.parseUnits(decimalString, decimals || 18);
  }

  public DSToBNS(
    decimalString: DecimalString,
    decimals?: number,
  ): BigNumberString {
    return BigNumberString(
      utils.parseUnits(decimalString, decimals || 18).toString(),
    );
  }
  /* End region of decimal string conversions */

  /* Conversion from big number to big number string and decimal string */
  public BNToBNS(bigNumber: BigNumber): BigNumberString {
    return BigNumberString(BigNumber.from(bigNumber).toString());
  }

  public BNToDS(bigNumber: BigNumber, decimals?: number): DecimalString {
    return DecimalString(utils.formatUnits(bigNumber, decimals || 18));
  }
  /* End region of big number conversions */

  /* Conversion from big number string to big number and decimal string */
  public BNSToBN(bigNumberString: BigNumberString): BigNumber {
    return BigNumber.from(bigNumberString);
  }

  public BNSToDS(
    bigNumberString: BigNumberString,
    decimals?: number,
  ): DecimalString {
    const valueBigNumber = BigNumber.from(bigNumberString);

    return DecimalString(utils.formatUnits(valueBigNumber, decimals || 18));
  }
  /* End region of big number string conversions */

  /**
   * This method returns true if the bigNumberString is a
   * @param bigNumberString
   * @returns true if bigNumberString is a valid BigNumber
   */
  public validateBNS(bigNumberString: string): boolean {
    try {
      BigNumber.from(bigNumberString);
      return true;
    } catch (e) {
      return false;
    }
  }
}
