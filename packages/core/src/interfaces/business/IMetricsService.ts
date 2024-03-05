import {
  NftRepositoryCache,
  PersistenceError,
  RuntimeMetrics,
  WalletNFTData,
  WalletNFTHistory,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The MetricsService provides access to runtime metrics for the core, such as the number
 * of api calls made.
 */
export interface IMetricsService {
  getMetrics(): ResultAsync<RuntimeMetrics, never>;
  initialize(): ResultAsync<void, never>;
  getNFTCache(): ResultAsync<NftRepositoryCache, PersistenceError>;
  getPersistenceNFTs(): ResultAsync<WalletNFTData[], PersistenceError>;
  getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
