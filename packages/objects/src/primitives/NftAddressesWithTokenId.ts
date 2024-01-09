import { Brand, make } from "ts-brand";

export type NftAddressesWithTokenId = Brand<string, "NftAddressesWithTokenId">;
export const NftAddressesWithTokenId = make<NftAddressesWithTokenId>();
