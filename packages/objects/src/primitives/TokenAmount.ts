import { Brand, make } from "ts-brand";

// The TokenAmount for an ERC-721 contract
export type TokenAmount = Brand<bigint, "TokenAmount">;
export const TokenAmount = make<TokenAmount>();
