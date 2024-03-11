import { EWalletDataType, IpfsCID } from "@snickerdoodlelabs/objects";

export class QueryMetadata {
  public constructor(
    public name: string,
    public points: number,
    public description: string,
    public questionnaires: IpfsCID[],
    public virtualQuestionnaires: EWalletDataType[],
    public image?: IpfsCID,
  ) {}
}
