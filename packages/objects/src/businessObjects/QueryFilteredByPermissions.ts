import { ISDQLCompensations, ISDQLAd } from "@objects/interfaces";
import { AdKey, CompensationId, QueryIdentifier } from "@objects/primitives";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: QueryIdentifier[],
    public expectedCompensationsMap: Map<CompensationId, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
  ) {}
}
