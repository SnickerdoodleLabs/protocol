import {
  ChainId,
  EChain,
  ECurrencyCode,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
  alchemyEndpoints: Map<EChain, URLString>;
}
