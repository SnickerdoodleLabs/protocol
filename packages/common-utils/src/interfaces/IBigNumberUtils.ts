import { BigNumberString } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";

export interface IBigNumberUtils {
  multiply(bn: BigNumber | BigNumberString, number: number): BigNumber;
  divide(bn: BigNumber | BigNumberString, number: number): BigNumber;
}

export const IBigNumberUtilsType = Symbol.for("IBigNumberUtils");
