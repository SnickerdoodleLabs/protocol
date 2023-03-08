import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import {
  IScamFilterRepository,
  IScamFilterRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data/IScamFilterRepository";
import { IScamFilterService } from "@synamint-extension-sdk/core/interfaces/business/IScamFilterService";

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
