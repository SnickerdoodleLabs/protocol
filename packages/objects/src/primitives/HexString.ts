import { Brand, make } from "ts-brand";

export type HexString = Brand<string, "HexString">;
export const HexString = make<HexString>();
