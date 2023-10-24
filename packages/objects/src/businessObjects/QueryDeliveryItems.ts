import { IQueryDeliveryInsights, IQueryDeliveryAds } from "@objects/interfaces";
import { IQueryDeliveryItems } from "@objects/interfaces/IQueryDeliveryItems.js";

export class QueryDeliveryItems implements IQueryDeliveryItems {
  public constructor(
    readonly insights: IQueryDeliveryInsights,
    readonly ads: IQueryDeliveryAds,
  ) {}
}
