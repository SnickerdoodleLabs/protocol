import { Brand, make } from "ts-brand";

export type NftTokenAddressWithTokenId = Brand<
  string,
  "NftTokenAddressWithTokenId"
>;
export const NftTokenAddressWithTokenId = make<NftTokenAddressWithTokenId>();
