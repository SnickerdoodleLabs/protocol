import {
  DomainName,
  RuntimeMetrics,
  WalletNFTData,
  WalletNFTHistory,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "../objects/errors/SnickerDoodleCoreError";

export interface IMetricsService {
  getMetrics(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError>;

  getPersistenceNFTs(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTData[], SnickerDoodleCoreError>;

  getNFTsHistory(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError>;

  getNFTCache(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<NftRepositoryCache, SnickerDoodleCoreError>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
