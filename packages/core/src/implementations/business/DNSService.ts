import { IDNSService } from "@core/interfaces/business/IDNSService";
import { IDNSRepository } from "@core/interfaces/data/IDNSRepository";
import { AjaxError, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class DNSService implements IDNSService {
  constructor(public dnsRepository: IDNSRepository) {}

  public fetchTXTRecords(domain: DomainName): ResultAsync<string[], AjaxError> {
    // @ts-ignore   TODO delete ts-ignore
    return this.dnsRepository.fetchTXTRecords(domain).filter((record) => record.startsWith("0x"));
  }
}