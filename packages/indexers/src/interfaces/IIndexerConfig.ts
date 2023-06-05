import {
  ChainId,
  EChain,
  ECurrencyCode,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  apiKeys: {
    alchemyApiKeys: Map<EChain, string | null>;
    etherscanApiKeys: Map<EChain, string | null>;
    covalentApiKey: string;
    moralisApiKey: string;
    nftScanApiKey: string;
    poapApiKey: string;
    oklinkApiKey: string;
    primaryInfuraKey: string;
    secondaryInfuraKey: string;
    ankrApiKey: string;
  };
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
  alchemyEndpoints: Map<EChain, URLString>;
}
