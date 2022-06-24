import { Brand, make } from "ts-brand";

export type TokenIdNumber = Brand<number, "TokenIdNumber">;
export const TokenIdNumber = make<TokenIdNumber>();
