import { EPermissionType, EWalletDataType } from "@objects/enum";
import { IpfsCID } from "@objects/primitives";

export class Permission {
  public constructor(
    public type: EPermissionType,
    public allowed: boolean,
    public virtual?: EWalletDataType | null,
    public questionnaires?: IpfsCID | null,
  ) {}
}
