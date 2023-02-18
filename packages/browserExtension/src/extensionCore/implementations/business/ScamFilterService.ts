import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  IScamFilterRepository,
  IScamFilterRepositoryType,
} from "@interfaces/data/IScamFilterRepository";
import { IScamFilterService } from "@interfaces/business/IScamFilterService";

@injectable()
export class ScamFilterService implements IScamFilterService {
  constructor(
    @inject(IScamFilterRepositoryType)
    protected scamFilterRepository: IScamFilterRepository,
  ) {}

  public checkEntity(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError> {
    return this.scamFilterRepository.checkEntity(domain);
  }
}
