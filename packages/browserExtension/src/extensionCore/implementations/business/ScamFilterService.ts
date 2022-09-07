import { DomainName } from "@snickerdoodlelabs/objects";
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

  public checkURL(
    domain: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.scamFilterRepository.checkURL(domain);
  }
}
