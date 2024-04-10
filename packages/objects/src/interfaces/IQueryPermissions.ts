import { EWalletDataType } from "@objects/enum/index.js";
import { IpfsCID } from "@objects/primitives/index.js";
export interface IQueryPermissions {
  questionnaires: IpfsCID[];
  virtualQuestionnaires: EWalletDataType[];
}
