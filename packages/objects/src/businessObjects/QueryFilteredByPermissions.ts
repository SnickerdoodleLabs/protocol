import { ISDQLCompensations, ISDQLAd } from "@objects/interfaces/index.js";
import {
  AdKey,
  CompensationId,
  QueryIdentifier,
} from "@objects/primitives/index.js";

export class QueryFilteredByPermissions {
  public constructor(
    public permittedQueryIds: QueryIdentifier[],
    public expectedCompensationsMap: Map<CompensationId, ISDQLCompensations>,
    public eligibleAdsMap: Map<AdKey, ISDQLAd>,
  ) {}
}
