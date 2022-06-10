import { Brand, make } from "ts-brand";

// The TokenId for an ERC-721 contract
export type TokenId = Brand<bigint, "TokenId">;
export const TokenId = make<TokenId>();
