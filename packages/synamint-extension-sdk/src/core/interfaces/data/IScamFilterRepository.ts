import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IScamFilterRepository {
  checkURL(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterRepositoryType = Symbol.for("IScamFilterRepository");
