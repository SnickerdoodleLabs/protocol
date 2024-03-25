import { EPermissionType, EWalletDataType } from "@objects/enum";
import { Permission } from "@objects/index";
import { EVMContractAddress, IpfsCID } from "@objects/primitives";

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
