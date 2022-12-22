import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtilsType,
  ICryptoUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  IpfsCID,
  EVMContractAddress,
  Signature,
  DataWalletAddress,
  EVMAccountAddress,
  HexString,
  EVMPrivateKey,
  BigNumberString,
  InsightString,
  URLString,
  TokenId,
  EarnedReward,
  QueryIdentifier,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
  insightDeliveryTypes,
  insightPreviewTypes,
  clearCloudBackupsTypes,
  signedUrlTypes,
} from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@insightPlatform/IInsightPlatformRepository.js";
import {
  IClearCloudBackupsParams,
  IDeliverInsightsParams,
  IExecuteMetatransactionParams,
  IReceiveEligibleCompIdsParams,
  ISignedUrlParams,
} from "@insightPlatform/params/index.js";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public clearAllBackups(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    walletAddress: EVMAccountAddress,
  ): ResultAsync<void, AjaxError> {
    const signableData = {
      walletAddress: walletAddress,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        clearCloudBackupsTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "/clearAllBackups"),
        );
        const postBody = {
          walletAddress: walletAddress,
          signature: signature,
        } as IClearCloudBackupsParams;
        return this.ajaxUtils.post<void>(
          url,
          postBody as unknown as Record<string, unknown>,
        );
      });
  }

  public getSignedUrl(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    fileName: string,
  ): ResultAsync<URLString, AjaxError> {
    const signableData = {
      fileName: fileName,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        signedUrlTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "/getSignedUrl"));
        const postBody = {
          fileName: fileName,
          signature: signature,
        } as ISignedUrlParams;
        return this.ajaxUtils.post<URLString>(
          url,
          postBody as unknown as Record<string, unknown>,
        );
      });
  }
  //
  public receiveEligibleCompensationIds(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    answeredQueries: QueryIdentifier[],
  ): ResultAsync<string[], AjaxError> {
    const signableData = {
      consentContractId: consentContractAddress,
      tokenId: tokenId,
      queryCID: queryCID,
      queries: JSON.stringify(answeredQueries),
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        insightPreviewTypes,
        signableData,
        signingKey,
      )
      .andThen((signature) => {
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "/insights/responses/preview"),
        );

        /* Following schema from .yaml file: */
        /* https://github.com/SnickerdoodleLabs/protocol/blob/develop/documentation/openapi/Insight%20Platform%20API.yaml */
        return this.ajaxUtils.post<string[]>(url, {
          consentContractId: consentContractAddress,
          queryCID: queryCID,
          tokenId: tokenId.toString(),
          queries: answeredQueries,
          signature: signature,
        } as IReceiveEligibleCompIdsParams as unknown as Record<string, unknown>);
      });
  }

  public deliverInsights(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    returns: InsightString[],
    rewardParameters: IDynamicRewardParameter[],
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<EarnedReward[], AjaxError> {
    const returnsString = JSON.stringify(returns);
    const parameters = JSON.stringify([]);
    if (rewardParameters !== undefined) {
      const parameters = JSON.stringify(rewardParameters);
    }

    const signableData = {
      consentContractId: consentContractAddress,
      tokenId: tokenId,
      queryCID: queryCID,
      returns: JSON.stringify(returns),
      rewardParameters: JSON.stringify(rewardParameters),
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        insightDeliveryTypes,
        signableData,
        signingKey,
      )
      .andThen((signature) => {
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "insights/responses"),
        );

        return this.ajaxUtils.post<EarnedReward[]>(url, {
          consentContractId: consentContractAddress,
          tokenId: tokenId.toString(),
          queryCID: queryCID,
          returns: returns,
          rewardParameters: rewardParameters,
          signature: signature,
        } as IDeliverInsightsParams as unknown as Record<string, unknown>);
      });
  }

  public executeMetatransaction(
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    value: BigNumberString,
    gas: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError> {
    const signingData = {
      accountAddress: accountAddress,
      contractAddress: contractAddress,
      nonce: nonce,
      value: value,
      gas: gas,
      data: data,
      metatransactionSignature: metatransactionSignature,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        executeMetatransactionTypes,
        signingData,
        signingKey,
      )
      .andThen((signature) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "metatransaction"));

        const postBody = {
          accountAddress: accountAddress,
          contractAddress: contractAddress,
          nonce: nonce,
          value: value,
          gas: gas,
          data: data,
          metatransactionSignature: metatransactionSignature,
          requestSignature: signature,
        } as IExecuteMetatransactionParams;

        return this.ajaxUtils.post<IExecuteMetatransactionResponse>(
          url,
          postBody as unknown as Record<string, unknown>,
        );
      })
      .map(() => {});
  }
}

// Refer to documentation/openapi/Insight Platform API.yaml
interface IExecuteMetatransactionResponse {
  success: boolean;
}
