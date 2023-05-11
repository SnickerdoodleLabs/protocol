import { IQueryDeliveryAds } from "@objects/interfaces/IQueryDeliveryAds.js";
import { IQueryDeliveryInsights } from "@objects/interfaces/IQueryDeliveryInsights.js";

export interface IQueryDeliveryItems {
  insights: IQueryDeliveryInsights | null;
  ads: IQueryDeliveryAds | null;
}
