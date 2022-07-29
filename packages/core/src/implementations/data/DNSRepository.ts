import { okAsync, ResultAsync } from "neverthrow";
import { IDNSRepository } from "@core/interfaces/data/IDNSRepository";
import {
  IConfigProviderType,
  IConfigProvider,
} from "@core/interfaces/utilities";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { urlJoin } from "url-join-ts";
import { ITXTRecords } from "../business/DNSService";

@injectable()
export class DNSRepository implements IDNSRepository {
  constructor(
    protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public fetchTXTRecords(
    domain: DomainName,
  ): ResultAsync<ITXTRecords[], AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(
            config.dnsServerAddress,
            encodeURIComponent(`?name=${domain}&type=TXT`),
          ),
        );
        return this.ajaxUtil.get<IGetTxtRecordsResponse>(url, {
          headers: { Accept: "application/dns-json" },
        });
      })
      .map((response) => {
        return response.Answer.map(function (txt) {
          return txt["data"];
        });
      });
  }
}
interface IGetTxtRecordsResponse {
  Answer: string[];
}
