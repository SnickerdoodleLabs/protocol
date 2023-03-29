import { ChainId, ECurrencyCode, URLString } from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  moralisApiKey: string;
  nftScanApiKey: string;
  poapApiKey: string;
  etherscanApiKeys: Map<ChainId, string>;
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
  alchemyEndpoints: {
    solana: string;
    solanaTestnet: string;
    polygon: string;
    polygonMumbai: string;
    arbitrum: string;
    optimism: string;
  };
}
