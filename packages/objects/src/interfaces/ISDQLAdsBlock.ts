import { ISDQLAd } from "@objects/interfaces/ISDQLAd.js";
import { AdKey } from "@objects/primitives/AdKey.js";

export interface ISDQLAdsBlock {
  [index: AdKey]: ISDQLAd;
}
