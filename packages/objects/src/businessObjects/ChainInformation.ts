import { EChain, EChainTechnology, EChainType } from "@objects/enum/index.js";
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
    public nativeCurrency: NativeCurrencyInformation,
    public type: EChainType,
    public explorerURL: string,
    public getExplorerURL: (txHash: string) => string,
    public contractStackDeployed: boolean,
    public operatorGatewayContractAddress: EVMContractAddress,
    public snickerdoodleWalletFactoryContractAddress: EVMContractAddress,
    public smartClearinghouseContractAddress: EVMContractAddress,
    public etherscanEndpointURL?: URLString,
    public coinGeckoSlug?: CoinGeckoAssetPlatformID, // this is the string id by which coin gecko uses for chains ("asset platforms")
  ) {}
}

// ControlChainInformation will go away after refactor, but keeping it for now
export class ControlChainInformation extends ChainInformation {
  constructor(
    name: string,
    chainId: ChainId,
    chain: EChain,
    chainTechnology: EChainTechnology,
    isDev: boolean,
    networkName: string,
    averageBlockMiningTime: number,
    nativeCurrency: NativeCurrencyInformation,
    type: EChainType,
    explorerURL: string,
    // If contractStackDeployed is false, the contract addresses will not be null (to make life easier) but will be invalid
    contractStackDeployed: boolean,
    operatorGatewayContractAddress: EVMContractAddress,
    snickerdoodleWalletFactoryContractAddress: EVMContractAddress,
    smartClearinghouseContractAddress: EVMContractAddress,
    // TODO: Remove, not part of new contract stack
    public consentFactoryContractAddress: EVMContractAddress,
    public governanceTokenContractAddress: EVMContractAddress,
    // TODO: Remove, not part of new contract stack
    public questionnairesContractAddress: EVMContractAddress,
    etherscanEndpointURL?: URLString,
    coinGeckoSlug?: CoinGeckoAssetPlatformID,
  ) {
    super(
      name,
      chainId,
      chain,
      chainTechnology,
      isDev,
      networkName,
      averageBlockMiningTime,
      nativeCurrency,
      type,
      explorerURL,
      function (txHash: string) {
        return explorerURL + txHash;
      },
      contractStackDeployed,
      operatorGatewayContractAddress,
      snickerdoodleWalletFactoryContractAddress,
      smartClearinghouseContractAddress,
      etherscanEndpointURL ? URLString(etherscanEndpointURL) : undefined,
      coinGeckoSlug,
    );
  }
}
