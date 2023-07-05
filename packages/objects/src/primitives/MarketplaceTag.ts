import { Brand, make } from "ts-brand";

export type MarketplaceTag = Brand<string, "MarketplaceTag">;
export const MarketplaceTag = make<MarketplaceTag>();
