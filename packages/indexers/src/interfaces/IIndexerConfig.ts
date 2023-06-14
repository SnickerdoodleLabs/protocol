import {
  ChainId,
  EChain,
  ECurrencyCode,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  apiKeys: {
    alchemyApiKeys: {
      Arbitrum: string;
      Astar: string;
      Mumbai: string;
      Optimism: string;
      Polygon: string;
      Solana: string;
      SolanaTestnet: string;
    };
    etherscanApiKeys: {
      Ethereum: string;
      Polygon: string;
      Avalanche: string;
      Binance: string;
      Moonbeam: string;
      Optimism: string;
      Arbitrum: string;
      Gnosis: string;
      Fuji: string;
    };
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
