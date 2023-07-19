import {
  EChain,
  EChainTechnology,
  EIndexer,
  EChainType,
} from "@objects/enum/index.js";
import {
  ChainId,
  EVMContractAddress,
  URLString,
  CoinGeckoAssetPlatformID,
} from "@objects/primitives/index.js";

export class NativeCurrencyInformation {
  public constructor(
    public name: string,
    public decimals: number,
    public symbol: string,
    public coinGeckoId?: string,
  ) {}
}

export class ChainInformation {
  public constructor(
    public name: string,
    public chainId: ChainId,
    public chain: EChain,
    public chainTechnology: EChainTechnology,
    public isDev: boolean,
    public networkName: string,
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
    public type: EChainType,
    public explorerURL: string,
    public getExplorerURL: (txHash: string) => string,
    public etherscanEndpointURL?: URLString,
    public coinGeckoSlug?: CoinGeckoAssetPlatformID, // this is the string id by which coin gecko uses for chains ("asset platforms")
  ) {}
}

export class ControlChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public chain: EChain,
    public chainTechnology: EChainTechnology,
    public isDev: boolean,
    public networkName: string,
    public averageBlockMiningTime: number,
    public indexer: EIndexer,
    public nativeCurrency: NativeCurrencyInformation,
    public type: EChainType,
    public explorerURL: string,
    public consentFactoryContractAddress: EVMContractAddress,
    public crumbsContractAddress: EVMContractAddress,
    public metatransactionForwarderAddress: EVMContractAddress,
    public siftContractAddress: EVMContractAddress,
    public etherscanEndpointURL?: URLString,
    public coinGeckoSlug?: CoinGeckoAssetPlatformID,
  ) {
    super(
      name,
      chainId,
      chain,
      chainTechnology,
      isDev,
      networkName,
      averageBlockMiningTime,
      indexer,
      nativeCurrency,
      type,
      explorerURL,
      function (txHash: string) {
        return explorerURL + txHash;
      },
      etherscanEndpointURL ? URLString(etherscanEndpointURL) : undefined,
      coinGeckoSlug,
    );
  }
}
