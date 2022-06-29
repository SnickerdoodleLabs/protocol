import { IDNSRepository } from "@core/interfaces/data";
import { DomainName, AjaxError } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

@inject()
export class DNSRepository implements IDNSRepository {
    public getTXTRecords(domainName: DomainName): ResultAsync<string[], AjaxError> {
        // Inject AxiosAjaxUtils and query the DNS from the insight platform.
        throw new Error("Method not implemented.");
    }

}