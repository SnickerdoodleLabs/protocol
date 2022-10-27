import { Brand, make } from "ts-brand";

export type ExpectedRewardString = Brand<string, "ExpectedRewardString">;
export const ExpectedRewardString = make<ExpectedRewardString>();
