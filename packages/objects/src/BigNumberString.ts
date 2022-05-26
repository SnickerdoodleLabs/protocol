import { Brand, make } from "ts-brand";

export type BigNumberString = Brand<string, "BigNumberString">;
export const BigNumberString = make<BigNumberString>();
