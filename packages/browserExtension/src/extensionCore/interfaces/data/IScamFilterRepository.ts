import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScamFilterRepository {
  checkURL(domain: DomainName): ResultAsync<string, SnickerDoodleCoreError>;
}
