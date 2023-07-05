import { Brand, make } from "ts-brand";

export type TokenSecret = Brand<string, "TokenSecret">;
export const TokenSecret = make<TokenSecret>();
