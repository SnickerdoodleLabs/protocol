import {
  BlockNumber,
  EthereumAccountAddress,
  EthereumContractAddress,
  IpfsCID,
} from "@objects/primatives";

export class RequestForData {
  public constructor(
    public consentContractAddress: EthereumContractAddress,
    public requesterAddress: EthereumAccountAddress,
    public requestedCID: IpfsCID,
    public blockNumber: BlockNumber,
  ) {}
}
