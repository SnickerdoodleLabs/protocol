import {
  ISDQLCompensations,
  ISDQLAd,
  ISDQLInsightBlock,
} from "@objects/interfaces";
import {
  AdKey,
  CompensationKey,
  InsightKey,
  SubQueryKey,
} from "@objects/primitives";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: SubQueryKey[],
    public expectedCompensationsMap: Map<CompensationKey, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
    public eligibleInsightsMap: Map<InsightKey, ISDQLInsightBlock>,
  ) {}
}
