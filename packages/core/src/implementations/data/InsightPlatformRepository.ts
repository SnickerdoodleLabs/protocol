import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EVMContractAddress,
  Signature,
  TokenId,
  DomainName,
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@core/interfaces/data";
import { BusinessConsentContract } from "@core/interfaces/objects";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IConfigProviderType) public configProvider: IConfigProvider,
  ) {}

  public claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, never> {
    throw new Error("undefined");
  }

  public deliverInsights(insights: Insight[]): ResultAsync<void, never> {
    throw new Error("undefined");
  }

  public deliverInsight(
    cId: IpfsCID,
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    signature: Signature,
    returns: Array<any>
    ): ResultAsync<void, AjaxError> {
      
      return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(
            config.defaultInsightPlatformBaseUrl,
            "responses"
          ),
        );
        return this.ajaxUtils.post<boolean>(url, {
          consentContractId: consentContractAddress,
          queryId: cId,
          dataWallet: dataWalletAddress,
          returns: returns,
          signature: signature
        });
      })
      .map((response) => {});
  }

  public getBusinessConsentContracts(): ResultAsync<
    BusinessConsentContract[],
    AjaxError
  > {
    throw new Error("undefined");
  }

  public acceptInvitation(
    dataWalletAddress: DataWalletAddress,
    invitation: CohortInvitation,
    signature: Signature,
  ): ResultAsync<void, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(
            config.defaultInsightPlatformBaseUrl,
            "cohort",
            encodeURIComponent(invitation.consentContractAddress),
            "leave",
          ),
        );
        return this.ajaxUtils.put<boolean>(url, {
          dataWallet: dataWalletAddress,
          tokenId: invitation.tokenId,
          businessSignature: invitation.businessSignature,
          signature: signature,
        });
      })
      .map((response) => {});
  }

  public leaveCohort(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    signature: Signature,
  ): ResultAsync<void, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(
            config.defaultInsightPlatformBaseUrl,
            "cohort",
            encodeURIComponent(consentContractAddress),
            "leave",
          ),
        );
        return this.ajaxUtils.put<boolean>(url, {
          dataWallet: dataWalletAddress,
          signature: signature,
        });
      })
      .map((response) => {});
  }

  public getTXTRecords(
    domainName: DomainName,
  ): ResultAsync<string[], AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(
            config.defaultInsightPlatformBaseUrl,
            "dns",
            encodeURIComponent(domainName),
            "txt",
          ),
        );
        return this.ajaxUtils.get<IGetTxtRecordsResponse>(url);
      })
      .map((response) => {
        return response.records;
      });
  }
}

// Refer to documentation/openapi/Insight Platform API.yaml
interface IGetTxtRecordsResponse {
  records: string[];
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
