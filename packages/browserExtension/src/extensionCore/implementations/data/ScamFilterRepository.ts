import { IScamFilterRepository } from "@interfaces/data/IScamFilterRepository";
import { IAccountCookieUtils, IErrorUtils } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { DomainName, ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class ScamFilterRepository implements IScamFilterRepository {
  constructor(
    protected core: ISnickerdoodleCore,
    protected errorUtils: IErrorUtils,
  ) {}

  public checkURL(
    domain: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.core.checkURL(domain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
