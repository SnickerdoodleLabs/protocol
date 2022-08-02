import { ChainId, ChainInformation } from "@snickerdoodlelabs/objects";

export interface IPersistenceConfig {
  supportedChains: ChainId[];
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  chainInformation: Map<ChainId, ChainInformation>;
}
