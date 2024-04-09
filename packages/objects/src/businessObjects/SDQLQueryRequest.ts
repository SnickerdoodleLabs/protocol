import { EVMContractAddress, IpfsCID } from "@objects/primitives/index.js";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly queryCID: IpfsCID,
  ) {}
}
