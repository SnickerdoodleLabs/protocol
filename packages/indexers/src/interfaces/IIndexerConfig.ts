import {
  EChain,
  ECurrencyCode,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  apiKeys: {
    alchemyApiKeys: {
      Arbitrum: string | null;
      Astar: string | null;
      Mumbai: string | null;
      Optimism: string | null;
      Polygon: string | null;
      Solana: string | null;
      SolanaTestnet: string | null;
    };
    etherscanApiKeys: {
      Ethereum: string | null;
      Polygon: string | null;
      Avalanche: string | null;
      Binance: string | null;
      Moonbeam: string | null;
      Optimism: string | null;
      Arbitrum: string | null;
      Gnosis: string | null;
      Fuji: string | null;
    };
    covalentApiKey: string | null;
    moralisApiKey: string | null;
    nftScanApiKey: string | null;
    poapApiKey: string | null;
    oklinkApiKey: string | null;
    ankrApiKey: string | null;
  };
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  alchemyEndpoints: Map<EChain, URLString>;
  devChainProviderURL: ProviderUrl | null;
}
