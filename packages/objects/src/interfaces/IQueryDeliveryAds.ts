import { AdSignature } from "@objects/businessObjects/versioned/AdSignature.js";

export interface IQueryDeliveryAds {
  [adKey: string]: AdSignature | null;
}
