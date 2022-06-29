import {
  IAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import { DomainName, AjaxError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDNSRepository } from "@core/interfaces/data";

@injectable()
export class DNSRepository implements IDNSRepository {
  public constructor(
    @inject(IAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}
  public getTXTRecords(
    domainName: DomainName,
  ): ResultAsync<string[], AjaxError> {
    // Inject AxiosAjaxUtils and query the DNS from the insight platform.
    throw new Error("Method not implemented.");
  }
}
