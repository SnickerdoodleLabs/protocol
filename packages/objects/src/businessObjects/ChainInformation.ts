import { ChainId, EthereumContractAddress } from "@objects/primatives";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public hasGovernance: boolean,
    public isDev: boolean,
    public interestingContractAddress: EthereumContractAddress,
  ) {}
}
