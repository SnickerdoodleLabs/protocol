import {
  ChainId,
  EthereumContractAddress,
  ProviderUrl,
} from "@objects/primatives";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
  ) {}
}

export class ControlChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public consentFactoryContractAddress: EthereumContractAddress,
    public providerUrls: ProviderUrl[],
  ) {
    super(name, chainId, isDev, providerUrls);
  }
}
