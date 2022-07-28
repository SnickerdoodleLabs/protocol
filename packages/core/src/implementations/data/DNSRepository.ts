import { DomainName, AjaxError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IDNSRepository } from "@core/interfaces/data";

@injectable()
export class DNSRepository implements IDNSRepository {
  public fetchTXTRecords(domain: DomainName): ResultAsync<string[], AjaxError> {
    return okAsync([]);
  }
}
