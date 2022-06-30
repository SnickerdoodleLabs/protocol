import {
  BlockNumber,
  EthereumAccountAddress,
  EthereumContractAddress,
  IpfsCID,
} from "@objects/primitives";

export class RequestForData {
  public constructor(
    public consentContractAddress: EthereumContractAddress,
    public requesterAddress: EthereumAccountAddress,
    public requestedCID: IpfsCID,
    public blockNumber: BlockNumber,
  ) {}
}
