import { injectable, inject } from "inversify";
import {
  DomainName,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  RuntimeMetrics,
  WalletNFTData,
  WalletNFTHistory,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import { IMetricsService } from "../../interfaces/business/IMetricsService";
import { ResultAsync } from "neverthrow";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "../../interfaces/utils/IErrorUtils";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

@injectable()
export class MetricsService implements IMetricsService {
  constructor(
    @inject(ISnickerdoodleCoreType) private core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) private errorUtils: IErrorUtils,
  ) {}

  public getMetrics(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError> {
    return this.core.metrics.getMetrics(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }

  public getPersistenceNFTs(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTData[], SnickerDoodleCoreError> {
    return this.core.metrics
      .getPersistenceNFTs(sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message);
      });
  }

  public getNFTsHistory(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFTHistory[], SnickerDoodleCoreError> {
    return this.core.metrics.getNFTsHistory(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }

  public getNFTCache(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<NftRepositoryCache, SnickerDoodleCoreError> {
    return this.core.metrics.getNFTCache(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message);
    });
  }
}
