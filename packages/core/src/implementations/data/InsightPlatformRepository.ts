import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtilsType,
  ICryptoUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EVMContractAddress,
  Signature,
  DomainName,
  DataWalletAddress,
  EVMAccountAddress,
  HexString,
  EVMPrivateKey,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { executeMetatransactionTypes } from "@snickerdoodlelabs/signature-verification";
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
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IConfigProviderType) public configProvider: IConfigProvider,
  ) {}

  public claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, never> {
    throw new Error("undefined");
  }

  // this cannot work as the required parameters such as signature cannot be created here.
  public deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    signature: Signature,
    returns: string 
    ): ResultAsync<void, never> {
      return this.configProvider
        .getConfig()
        .andThen((config) => {
          const url = new URL(
            urlJoin(
              config.defaultInsightPlatformBaseUrl,
              "responses"
            )
          );
          return this.ajaxUtils.post<boolean>(url, {
            consentContractId: consentContractAddress,
            queryId: queryId,
            dataWallet: dataWalletAddress,
            returns: returns,
            signature: signature,
          });
        })
        .map((response) => {
          if
        });
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

  public executeMetatransaction(
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const value = {
          accountAddress: accountAddress,
          contractAddress: contractAddress,
          nonce: nonce,
          data: data,
          metatransactionSignature: metatransactionSignature,
        } as Record<string, unknown>;

        return this.cryptoUtils
          .signTypedData(
            config.snickerdoodleProtocolDomain,
            executeMetatransactionTypes,
            value,
            dataWalletKey,
          )
          .andThen((signature) => {
            const url = new URL(
              urlJoin(config.defaultInsightPlatformBaseUrl, "metatransaction"),
            );

            const postBody = {
              dataWallet: dataWalletAddress,
              accountAddress: accountAddress,
              contractAddress: contractAddress,
              nonce: nonce,
              data: data,
              metatransactionSignature: metatransactionSignature,
              signature: signature,
            };

            console.log("postBody", postBody);

            return this.ajaxUtils.post<IExecuteMetatransactionResponse>(
              url,
              postBody,
            );
          });
      })
      .map(() => {});
  }
}

// Refer to documentation/openapi/Insight Platform API.yaml
interface IGetTxtRecordsResponse {
  records: string[];
}

interface IExecuteMetatransactionResponse {}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
