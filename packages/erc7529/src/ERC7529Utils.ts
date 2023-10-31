import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IERC7529Contract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainCommonErrors,
  ChainId,
  DomainName,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IERC7529ConfigProviderType,
  IERC7529ConfigProvider,
} from "@erc7529/IERC7529ConfigProvider.js";
import { IERC7529Utils } from "@erc7529/IERC7529Utils.js";

@injectable()
export class ERC7529Utils implements IERC7529Utils {
  public constructor(
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IERC7529ConfigProviderType)
    protected configProvider: IERC7529ConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public verifyContractForDomain<TContractErr>(
    contract: IERC7529Contract<TContractErr>,
    domain: DomainName,
    chainId: ChainId,
  ): ResultAsync<boolean, AjaxError | BlockchainCommonErrors | TContractErr> {
    return ResultUtils.combine([
      contract.getDomains(),
      this.getContractsFromDomain(domain, chainId),
    ]).map(([domains, contractAddresses]) => {
      return (
        domains.some((d) => {
          return d.toLowerCase() == domain.toLowerCase();
        }) &&
        contractAddresses.some((c) => {
          return c.toLowerCase() == contract.getContractAddress().toLowerCase();
        })
      );
    });
  }

  public getContractsFromDomain(
    domain: DomainName,
    chainId: ChainId,
  ): ResultAsync<EVMContractAddress[], AjaxError> {
    // TODO: Verify the domain is an ETLD+1 and/or correct it

    return this.fetchTXTRecords(domain, chainId).map((txtRecords) => {
      // to avoid TXT records which were not shaped as JSON
      return txtRecords
        .map((txtRecord) => {
          return txtRecord.split(",").reduce((addresses, potentialAddress) => {
            // Check that each record is a valid EVMContractAddress
            try {
              addresses.push(
                EVMContractAddress(
                  ethers.utils
                    .getAddress(potentialAddress.trim().toLowerCase())
                    .toLowerCase(),
                ),
              );
            } catch (err) {
              this.logUtils.warning(
                `Error parsing address from TXT record. Value: ${potentialAddress}`,
                err,
              );
            }
            return addresses;
          }, new Array<EVMContractAddress>());
        })
        .flat();
    });
  }

  protected fetchTXTRecords(
    domain: DomainName,
    chainId: ChainId,
  ): ResultAsync<string[], AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // Get the first page of results, if this exists it will always exist
        const url = new URL(
          urlJoinP(config.dnsProviderBaseUrl, [], {
            name: `erc-7529.${chainId}._domaincontracts.${domain}`,
            type: "TXT",
          }),
        );
        // TODO: Remove this after we've fully migrated
        const snickerdoodleUrl = new URL(
          urlJoinP(config.dnsProviderBaseUrl, [], {
            name: `snickerdoodle-protocol.${domain}`,
            type: "TXT",
          }),
        );
        return ResultUtils.combine([
          this.ajaxUtils.get<IGetTxtRecordsResponse>(url, {
            headers: { Accept: "application/dns-json" },
          }),
          this.ajaxUtils.get<IGetTxtRecordsResponse>(snickerdoodleUrl, {
            headers: { Accept: "application/dns-json" },
          }),
        ]);
      })
      .map(([response, snickerdoodleResponse]) => {
        const records = new Array<string>();

        if (response.Answer != null) {
          response.Answer.reduce((records, txtRecord) => {
            // txtRecord.Data comes back as a string- WITH QUOTES, '"string"'.
            // We need to remove the quotes
            try {
              const stringOnly = JSON.parse(txtRecord.data);
              records.push(stringOnly);
            } catch (err) {
              this.logUtils.warning(
                `Error parsing TXT record. Value: ${txtRecord.data}`,
                err,
              );
            }
            return records;
          }, records);
        }

        if (snickerdoodleResponse.Answer != null) {
          snickerdoodleResponse.Answer.reduce((records, txtRecord) => {
            // txtRecord.Data comes back as a string- WITH QUOTES, '"string"'.
            // We need to remove the quotes
            try {
              const stringOnly = JSON.parse(txtRecord.data);
              records.push(stringOnly);
            } catch (err) {
              this.logUtils.warning(
                `Error parsing TXT record. Value: ${txtRecord.data}`,
                err,
              );
            }
            return records;
          }, records);
        }
        return records;
      });
  }
}

interface IGetTxtRecordsResponse {
  Answer?: ITXTRecords[];
}
interface ITXTRecords {
  name: string;
  type: number;
  TTL: number;
  data: string;
}
