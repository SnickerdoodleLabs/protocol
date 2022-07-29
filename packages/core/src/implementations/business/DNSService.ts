import { IDNSService } from "@core/interfaces/business/IDNSService";
import { IDNSRepository } from "@core/interfaces/data/IDNSRepository";
import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class DNSService implements IDNSService {
  constructor(public dnsRepository: IDNSRepository) {}

  public fetchTXTRecords(domain: DomainName): ResultAsync<string[], AjaxError> {
    // @ts-ignore // TODO delete ts ignore
    return this.formatTxtRecords(this.dnsRepository.fetchTXTRecords(domain));
  }
  formatTxtRecords(txtRecords: string[]) {
    // txtRecords = [{data:'0x999'},{data:'0x999,0x1111'},{data:'0x999'},{data:'01x999'}];
    // return = ["0x999", "0x999", "0x1111", "0x999"]
    let formatedContractAddresses: string[] = [];
    txtRecords
      .map(function (txt) {
        return txt["data"];
      })
      .filter((record) => {
        record.startsWith("0x");
      })
      .map((contract) => {
        const splittedArray = contract.split(",");
        formatedContractAddresses = [
          ...formatedContractAddresses,
          ...splittedArray,
        ];
      });
    return formatedContractAddresses;
  }
}
