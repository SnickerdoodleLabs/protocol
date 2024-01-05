import {
  DomainName,
  NftRepositoryCache,
  RuntimeMetrics,
  WalletNFTData,
  WalletNFTHistory,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IMetricsService {
  getMetrics(
    sourceDomain?: DomainName,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError>;
  getPersistenceNFTs(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFTData[], SnickerDoodleCoreError>;
  getNFTCache(
    sourceDomain?: DomainName,
  ): ResultAsync<NftRepositoryCache, SnickerDoodleCoreError>;
  getNFTsHistory(
    sourceDomain?: DomainName,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
