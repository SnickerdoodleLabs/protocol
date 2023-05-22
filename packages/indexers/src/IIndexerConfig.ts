import {
  ChainId,
  EChain,
  ECurrencyCode,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  apiKeys: {
    covalentApiKey: string;
    moralisApiKey: string;
    nftScanApiKey: string;
    poapApiKey: string;
    oklinkApiKey: string;
    primaryInfuraKey: string;
    secondaryInfuraKey: string;
    ankrApiKey: string;
  };
  etherscanApiKeys: Map<ChainId, string>;
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
  alchemyEndpoints: Map<EChain, URLString>;
}
