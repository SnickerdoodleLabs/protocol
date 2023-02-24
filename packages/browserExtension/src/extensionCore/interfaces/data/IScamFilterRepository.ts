import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IScamFilterRepository {
  checkURL(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterRepositoryType = Symbol.for("IScamFilterRepository");
