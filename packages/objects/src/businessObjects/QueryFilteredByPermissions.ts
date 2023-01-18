import { AdKey, CompensationId, QueryIdentifier } from "@objects/primitives";
import { ISDQLCompensations, ISDQLAd } from "@objects/interfaces";


export class QueryFilteredByPermissions {
    public constructor(
        public permittedQueryIds: QueryIdentifier[],
        public expectedCompensationsMap:  Map<CompensationId, ISDQLCompensations>,
        public eligibleAdsMap:  Map<AdKey, ISDQLAd>,
    ) {}
}
