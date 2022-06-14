import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public hasGovernance: boolean,
    public isDev: boolean,
    public consentFactoryContractAddress: EthereumContractAddress,
    public consentContractAddress: EthereumContractAddress,
  ) {}
}
