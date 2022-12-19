import { EChain, EChainTechnology, EIndexer, EChainType } from "@objects/enum";
import {
  ChainId,
  EVMContractAddress,
  HexString,
  ProviderUrl,
} from "@objects/primitives";

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
    public chain: EChain,
    public chainTechnology: EChainTechnology,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
    public type: EChainType,
    public explorerURL: string,
    public getExplorerURL: (txHash: string) => string,
  ) {}
}

export class ControlChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public chain: EChain,
    public chainTechnology: EChainTechnology,
    public isDev: boolean,
    public providerUrls: ProviderUrl[],
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
    public type: EChainType,
    public explorerURL: string,
    public consentFactoryContractAddress: EVMContractAddress,
    public crumbsContractAddress: EVMContractAddress,
    public metatransactionForwarderAddress: EVMContractAddress,
    public siftContractAddress: EVMContractAddress,
  ) {
    super(
      name,
      chainId,
      chain,
      chainTechnology,
      isDev,
      providerUrls,
      averageBlockMiningTime,
      indexer,
      nativeCurrency,
      type,
      explorerURL,
      function (txHash: string) {
        return explorerURL + txHash;
      },
    );
  }
}
