import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDNSRepository {
    fetchTXTRecords(domain: DomainName): ResultAsync<string[], AjaxError>;
}