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
    Arbitrum: string;
    Optimism: string;
  };
  sxtEndpoint: string;
  zettablockApis: {
    arbitrum_mainnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    bsc_mainnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    ethereum_mainnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    ethereum_testnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    polygon_mainnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    polygon_mumbai: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
    solana_mainnet: {
      balances: {
        native: string;
        nonnative: string;
      };
      nfts: string;
    };
  };
}
