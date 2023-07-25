import { AdKey } from "@objects/primitives/AdKey.js";
import { ISDQLAd } from "@objects/interfaces/ISDQLAd.js";

export interface ISDQLAdsBlock {
  [index: AdKey]: ISDQLAd;
}
