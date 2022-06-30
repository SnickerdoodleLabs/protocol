import {
  ChainId,
  EthereumContractAddress,
  ProviderUrl,
} from "@objects/primitives";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
  ) {}
}

export class ControlChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
    public consentFactoryContractAddress: EthereumContractAddress,
  ) {
    super(name, chainId, isDev, providerUrls, averageBlockMiningTime);
  }
}
