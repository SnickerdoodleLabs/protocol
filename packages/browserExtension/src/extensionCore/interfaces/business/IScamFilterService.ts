import { SnickerDoodleCoreError } from "@shared/objects/errors";
import { DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScamFilterService {
  checkURL(domain: DomainName): ResultAsync<string, SnickerDoodleCoreError>;
}
export const IScamFilterServiceType = Symbol.for("IScamFilterService");
