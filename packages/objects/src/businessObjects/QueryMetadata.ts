import { EWalletDataType } from "@objects/enum/EWalletDataType.js";
import { IpfsCID, JSONString } from "@objects/primitives/index.js";

export class QueryMetadata {
  public constructor(
    public queryCID: IpfsCID,
    public name: string,
    public points: number,
    public description: string,
    public questionnaires: IpfsCID[],
    public virtualQuestionnaires: EWalletDataType[],
    public dynamicRewardParameter: JSONString,
    public image?: IpfsCID,
  ) {}
}
