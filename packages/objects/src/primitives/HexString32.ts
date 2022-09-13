import { Brand, make } from "ts-brand";

// A Hex String that represents 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type HexString32 = Brand<string, "HexString32">;
export const HexString32 = make<HexString32>();
