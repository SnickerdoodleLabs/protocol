import {
  BlockNumber,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
} from "@objects/primitives/index.js";

export class RequestForData {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public requesterAddress: EVMAccountAddress,
    public requestedCID: IpfsCID,
    public blockNumber: BlockNumber,
  ) {}
}
