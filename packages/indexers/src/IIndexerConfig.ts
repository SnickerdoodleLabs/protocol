import {
  ChainId,
  ChainInformation,
  ECurrencyCode,
} from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  moralisApiKey: string;
  quoteCurrency: ECurrencyCode;
  supportedChains: ChainId[];
}
