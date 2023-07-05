import { BigNumber } from "ethers";
import { Brand, make } from "ts-brand";

export type BigNumberString = Brand<string, "BigNumberString">;
export const BigNumberString = make<BigNumberString>();

export function addBigNumberString(
  a: BigNumberString,
  b: BigNumberString,
): BigNumberString {
  return BigNumberString(BigNumber.from(a).add(BigNumber.from(b)).toString());
}

export function multiplyBigNumberString(
  a: BigNumberString,
  b: BigNumberString,
): BigNumberString {
  return BigNumberString(BigNumber.from(a).mul(BigNumber.from(b)).toString());
}
