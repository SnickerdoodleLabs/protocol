import {
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  RuntimeMetrics,
  DomainName,
  NftRepositoryCache,
  WalletNFTData,
  WalletNFTHistory,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IMetricsService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IErrorUtilsType,
  IErrorUtils,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class MetricsService implements IMetricsService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  getPersistenceNFTs(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTData[], SnickerDoodleCoreError> {
    return this.core.metrics
      .getPersistenceNFTs(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  getNFTCache(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<NftRepositoryCache, SnickerDoodleCoreError> {
    return this.core.metrics.getNFTCache(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getNFTsHistory(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError> {
    return this.core.metrics.getNFTsHistory(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getMetrics(
    sourceDomain?: DomainName,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError> {
    return this.core.metrics.getMetrics(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
