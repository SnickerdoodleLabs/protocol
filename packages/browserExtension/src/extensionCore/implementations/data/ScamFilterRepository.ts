import {
  DomainName,
  EScamFilterStatus,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IScamFilterRepository } from "@interfaces/data/IScamFilterRepository";
import { IErrorUtils, IErrorUtilsType } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

@injectable()
export class ScamFilterRepository implements IScamFilterRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public checkEntity(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError> {
    return this.core.checkEntity(domain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
