import { ChainId, ChainInformation } from "@snickerdoodlelabs/objects";

export interface IIndexerConfig {
  covalentApiKey: string;
  moralisApiKey: string;
  quoteCurrency: string;
  chainInformation: Map<ChainId, ChainInformation>;
}
