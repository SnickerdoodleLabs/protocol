import {
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  RuntimeMetrics,
  DomainName,
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
  ) { }

  public getMetrics(
    sourceDomain?: DomainName,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError> {
    return this.core.metrics.getMetrics(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getUnlocked(
    sourceDomain?: DomainName,
  ): ResultAsync<boolean, SnickerDoodleCoreError> {
    return this.core.metrics.getUnlocked(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
