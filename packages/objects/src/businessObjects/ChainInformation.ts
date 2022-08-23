import { EIndexer } from "@objects/enum";
import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primitives";

export class NativeCurrencyInformation {
  public constructor(
    public name: string,
    public decimals: number,
    public symbol: string,
  ) {}
}

export class ChainInformation {
  public constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
  ) {}
}

export class ControlChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
    public consentFactoryContractAddress: EVMContractAddress,
    public crumbsContractAddress: EVMContractAddress,
    public metatransactionForwarderAddress: EVMContractAddress,
  ) {
    super(
      name,
      chainId,
      isDev,
      providerUrls,
      averageBlockMiningTime,
      indexer,
      nativeCurrency,
    );
  }
}
