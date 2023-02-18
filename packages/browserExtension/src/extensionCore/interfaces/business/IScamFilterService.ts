import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IScamFilterService {
  checkEntity(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterServiceType = Symbol.for("IScamFilterService");
