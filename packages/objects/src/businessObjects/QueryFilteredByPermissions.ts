import {
  ISDQLAd,
  ISDQLCompensations,
  ISDQLInsightBlock,
} from "@objects/interfaces";
import { AdKey, CompensationKey, InsightKey } from "@objects/primitives";

import {SubQueryKey} from "@objects/primitives/SubQueryKey.js";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: SubQueryKey[],
    public expectedCompensationsMap: Map<CompensationKey, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
    public eligibleInsightsMap: Map<InsightKey, ISDQLInsightBlock>,
  ) {}
}
