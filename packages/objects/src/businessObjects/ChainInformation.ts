import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primatives";

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
    public consentFactoryContractAddress: EVMContractAddress,
  ) {
    super(name, chainId, isDev, providerUrls, averageBlockMiningTime);
  }
}
