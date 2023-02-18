import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScamFilterRepository {
  checkEntity(domain: DomainName): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterRepositoryType = Symbol.for("IScamFilterRepository");
