import { ChainId, EChain, ECurrencyCode } from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  moralisApiKey: string;
  etherscanApiKey: string;
  etherscanTransactionsBatchSize: number;
  alchemyKeys: Map<EChain, string>;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
}
