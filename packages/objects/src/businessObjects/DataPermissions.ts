import { EPermissionType, EWalletDataType } from "@objects/enum";
import { EVMContractAddress, IpfsCID } from "@objects/primitives";
import { Permission } from "@objects/index";

export class DataPermissions {
  constructor(
    protected readonly consentContractAddress: EVMContractAddress,
    protected readonly virtual: EWalletDataType[],
    protected readonly questionnaires: IpfsCID[],
  ) {}

  public checkHasVirtualPermission(EWalletDataType): boolean {
    return this.virtual.includes(EWalletDataType) ?? false;
  }
  public checkHasQuestionnairePermission(IpfsCID): boolean {
    return this.questionnaires.includes(IpfsCID) ?? false;
  }
  public checkPermission(permission: Permission): boolean {
    switch (permission.type) {
      case EPermissionType.Virtual:
        return this.checkHasVirtualPermission(permission.virtual);
      case EPermissionType.Questionnaires:
        return this.checkHasQuestionnairePermission(permission.questionnaires);
      default:
        return false;
    }
  }
}
