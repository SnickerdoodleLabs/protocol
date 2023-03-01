import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IScamFilterService } from "@interfaces/business/IScamFilterService";
import {
  IScamFilterRepository,
  IScamFilterRepositoryType,
} from "@interfaces/data/IScamFilterRepository";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

@injectable()
export class ScamFilterService implements IScamFilterService {
  constructor(
    @inject(IScamFilterRepositoryType)
    protected scamFilterRepository: IScamFilterRepository,
  ) {}

  public checkURL(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError> {
    return this.scamFilterRepository.checkURL(domain);
  }
}
