import { Brand, make } from "ts-brand";

export type CryptoTokenSymbol = Brand<string, "CryptoTokenSymbol">;
export const CryptoTokenSymbol = make<CryptoTokenSymbol>();
