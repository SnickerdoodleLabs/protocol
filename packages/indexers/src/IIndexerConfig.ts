import { ChainId, EChain, ECurrencyCode } from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  moralisApiKey: string;
  etherscanApiKey: string;
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
  alchemyEndpoints: {
    solana: string;
    solanaTestnet: string;
  };
}
