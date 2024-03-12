import { ethers } from "ethers";

import { EWalletDataType } from "@objects/enum/index.js";
import {
  EVMContractAddress,
  HexString32,
  IpfsCID,
} from "@objects/primitives/index.js";

export class DataPermissions {
  constructor(
    public consentContractAddress: EVMContractAddress,
    public virtual: EWalletDataType[] | null,
    public questionnaires: IpfsCID[] | null,
  ) {}
}
