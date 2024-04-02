import { EWalletDataType } from "@objects/enum/index.js";
import { EVMContractAddress, IpfsCID } from "@objects/primitives/index.js";

export class DataPermissions {
  constructor(
    public consentContractAddress: EVMContractAddress,
    public virtual: EWalletDataType[],
    public questionnaires: IpfsCID[],
  ) {}

  public checkHasVirtualPermission(dataType: EWalletDataType): boolean {
    return this.virtual.includes(dataType);
  }
  public checkHasQuestionnairePermission(cid: IpfsCID): boolean {
    return this.questionnaires.includes(cid);
  }
  public checkPermission(permission: IpfsCID | EWalletDataType): boolean {
    return (
      this.checkHasQuestionnairePermission(permission as IpfsCID) ||
      this.checkHasVirtualPermission(permission as EWalletDataType)
    );
  }
}
