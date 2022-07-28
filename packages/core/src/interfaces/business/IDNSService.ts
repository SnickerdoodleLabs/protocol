import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDNSService{
    fetchTXTRecords(domain:DomainName): ResultAsync<string[], AjaxError>
}