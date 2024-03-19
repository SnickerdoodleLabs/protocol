import { EPermissionType, EWalletDataType } from "@objects/enum";
import { EVMContractAddress, IpfsCID } from "@objects/primitives";
import { Permission } from "@objects/index";

export class DataPermissions {
  constructor(
    protected readonly consentContractAddress: EVMContractAddress,
    protected readonly virtual: EWalletDataType[],
    protected readonly questionnaires: IpfsCID[],
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
