import { Brand, make } from "ts-brand";

export type CoinGeckoAssetPlatformID = Brand<
  string,
  "CoinGeckoAssetPlatformID"
>;
export const CoinGeckoAssetPlatformID = make<CoinGeckoAssetPlatformID>();
