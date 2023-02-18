import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScamFilterService {
  checkEntity(domain: DomainName): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterServiceType = Symbol.for("IScamFilterService");
