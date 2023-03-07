import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { DomainName, EScamFilterStatus } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScamFilterService {
  checkURL(domain: DomainName): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError>;
}
export const IScamFilterServiceType = Symbol.for("IScamFilterService");
