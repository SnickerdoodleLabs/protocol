import {
  ISDQLCompensations,
  ISDQLAd,
  ISDQLInsightBlock,
} from "@objects/interfaces";
import {
  AdKey,
  CompensationId,
  InsightKey,
  SubqueryKey,
} from "@objects/primitives";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: SubqueryKey[],
    public expectedCompensationsMap: Map<CompensationId, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
    public eligibleInsightsMap: Map<InsightKey, ISDQLInsightBlock>,
  ) {}
}
