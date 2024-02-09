import { BigNumberString, DecimalString } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";

export interface IBigNumberUtils {
  multiply(
    bn: BigNumber | BigNumberString,
    number: number,
    decimals?: number,
  ): BigNumber;
  divide(
    bn: BigNumber | BigNumberString,
    number: number,
    decimals?: number,
  ): BigNumber;
  DSToBN(decimalString: DecimalString, decimals?: number): BigNumber;
  DSToBNS(decimalString: DecimalString, decimals?: number): BigNumberString;
  BNToBNS(bigNumber: BigNumber): BigNumberString;
  BNToDS(bigNumber: BigNumber, decimals?: number): DecimalString;
  BNSToBN(bigNumberString: BigNumberString): BigNumber;
  BNSToDS(bigNumberString: BigNumberString, decimals?: number): DecimalString;
  validateBNS(bigNumberString: string): boolean;
}

export const IBigNumberUtilsType = Symbol.for("IBigNumberUtils");
