import { BigNumberString } from "@snickerdoodlelabs/objects";
import { BigNumber, utils } from "ethers";
import { IBigNumberUtils } from "@common-utils/interfaces/index.js";

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
}
