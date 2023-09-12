import {
  EChain,
  ECurrencyCode,
  IApiKeys,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  apiKeys: IApiKeys;
  etherscanTransactionsBatchSize: number;
  quoteCurrency: ECurrencyCode;
  alchemyEndpoints: Map<EChain, URLString>;
  devChainProviderURL: ProviderUrl | null;
}
