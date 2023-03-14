import { ISDQLCompensations, ISDQLAd, ISDQLReturn } from "@objects/interfaces";
import {
  AdKey,
  CompensationId,
  QueryIdentifier,
  ReturnKey,
} from "@objects/primitives";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: QueryIdentifier[],
    public returnsMap: Map<ReturnKey, ISDQLReturn>,
    public expectedCompensationsMap: Map<CompensationId, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
  ) {}
}
