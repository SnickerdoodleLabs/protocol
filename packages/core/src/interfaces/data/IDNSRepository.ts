import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDNSRepository {
  getTXTRecords(domainName: DomainName): ResultAsync<string[], AjaxError>;
}

export const IDNSRepositoryType = Symbol.for("IDNSRepository");
