import {
  DomainName,
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IAccountService } from "@interfaces/business";
import { IAccountRepository, IAccountRepositoryType } from "@interfaces/data";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";
import { ISiftContractRepositoryType } from "@snickerdoodlelabs/core/src/interfaces/data";
import { IScamFilterRepository } from "@interfaces/data/IScamFilterRepository";
import { IScamFilterService } from "@interfaces/business/IScamFilterService";

@injectable()
export class ScamFilterService implements IScamFilterService {
  constructor(
    @inject(ISiftContractRepositoryType)
    protected scamFilterRepository: IScamFilterRepository,
  ) {}

  public checkURL(
    domain: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.scamFilterRepository.checkURL(domain);
  }
}
