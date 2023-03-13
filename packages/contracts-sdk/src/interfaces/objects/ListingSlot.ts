import { Brand, make } from "ts-brand";

// The TokenId for an ERC-721 contract
export type ListingSlot = Brand<bigint, "ListingSlot">;
export const ListingSlot = make<ListingSlot>();
