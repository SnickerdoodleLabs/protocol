import { IpfsCID, URLString } from "@objects/primitives";
import { ERewardType } from "@objects/enum";

/* Query from Insight Preview to be answered in Insight Platform */
export class QueryIdentifier {
  public constructor(
    public identifier: string 
  ) {}
}