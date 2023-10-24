import { Brand, make } from "ts-brand";

// A Hex String that represents a color object WITHOUT pre-pended # -- e.g., "FF0000"
export type HexColorString = Brand<string, "HexColorString">;
export const HexColorString = make<HexColorString>();
