import { Brand, make } from "ts-brand";

// HexString is always prefixed with 0x and encoded in hex
export type HexString = Brand<string, "HexString">;
export const HexString = make<HexString>();
