import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

import { IDNSRepository } from "@core/interfaces/data/IDNSRepository";
import {
  IConfigProviderType,
  IConfigProvider,
} from "@core/interfaces/utilities";

@injectable()
export class DNSRepository implements IDNSRepository {
  constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public fetchTXTRecords(domain: DomainName): ResultAsync<string[], AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoinP(config.dnsServerAddress, [], {
            name: domain,
            type: "TXT",
          }),
        );
        return this.ajaxUtil.get<IGetTxtRecordsResponse>(url, {
          headers: { Accept: "application/dns-json" },
        });
      })
      .map((response) => {
        return response.Answer.map((txtRecord) => {
          return txtRecord.data;
        });
      })
      .orElse((error) => {
        console.log("error from fetchTXTRecords", error);
        return errAsync(error);
      });
  }

  // // Not sure about using something like this
  // formatTxtRecords(
  //   txtRecords: ITXTRecords[],
  // ): ResultAsync<string[], AjaxError> {
  //   // txtRecords = [{data:'0x999'},{data:'0x999,0x1111'},{data:'0x999'},{data:'01x999'}];
  //   // return = ["0x999", "0x999", "0x1111", "0x999"]
  //   let formatedContractAddresses: string[] = [];
  //   txtRecords
  //     .map(function (txt) {
  //       return txt["data"];
  //     })
  //     .filter((record) => {
  //       return record?.startsWith("0x");
  //     })
  //     .map((contract) => {
  //       const splittedArray = contract?.split(",");
  //       formatedContractAddresses = [
  //         ...formatedContractAddresses,
  //         ...splittedArray,
  //       ];
  //     });
  //   return okAsync(formatedContractAddresses);
  // }
}
interface IGetTxtRecordsResponse {
  Answer: ITXTRecords[];
}
interface ITXTRecords {
  name: string;
  type: number;
  TTL: number;
  data: string;
}
