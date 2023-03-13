import { Brand, make } from "ts-brand";

// The TokenId for an ERC-721 contract
export type TagSlot = Brand<bigint, "TagSlot">;
export const TagSlot = make<TagSlot>();
