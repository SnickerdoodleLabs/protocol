import { Brand, make } from "ts-brand";

export type BigNumberString = Brand<string, "BigNumberString">;
export const BigNumberString = make<BigNumberString>();

export function addBigNumberString(
  a: BigNumberString,
  b: BigNumberString,
): BigNumberString {
  return BigNumberString((BigInt(a) + BigInt(b)).toString());
}

export function multiplyBigNumberString(
  a: BigNumberString,
  b: BigNumberString,
): BigNumberString {
  return BigNumberString((BigInt(a) * BigInt(b)).toString());
}
