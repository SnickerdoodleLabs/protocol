import {
  ISDQLCompensations,
  ISDQLAd,
  ISDQLInsightBlock,
} from "@objects/interfaces";
import {
  AdKey,
  CompensationId,
  InsightKey,
  QueryIdentifier,
} from "@objects/primitives";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: QueryIdentifier[],
    public expectedCompensationsMap: Map<CompensationId, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
    public eligibleInsightsMap: Map<InsightKey, ISDQLInsightBlock>,
  ) {}
}
