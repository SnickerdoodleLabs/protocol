import { ethers } from "ethers";

import { EWalletDataType } from "@objects/enum/index.js";
import {
  EVMContractAddress,
  HexString32,
  IpfsCID,
} from "@objects/primitives/index.js";

export class DataPermissions {
  constructor(
    protected readonly consentContractAddress: EVMContractAddress,
    protected readonly virtual: EWalletDataType[] | null,
    protected readonly questionnaires: IpfsCID[] | null,
  ) {}
}
