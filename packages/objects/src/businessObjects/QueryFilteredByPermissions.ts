import { AdKey, CompensationKey, QueryIdentifier } from "@objects/primitives";
import { ISDQLCompensations, ISDQLAd } from "@objects/interfaces";


export class QueryFilteredByPermissions {
    public constructor(
        public permittedQueryIds: QueryIdentifier[],
        public expectedCompensationsMap:  Map<CompensationKey, ISDQLCompensations>,
        public eligibleAdsMap:  Map<AdKey, ISDQLAd>,
    ) {}
}
