import { Storage, GetSignedUrlResponse, Bucket, GetFilesResponse } from "@google-cloud/storage";
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
  EligibleReward,
  EarnedReward,
  QueryIdentifier,
  IDynamicRewardParameter,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
  insightDeliveryTypes,
  insightPreviewTypes,
  authorizationBackupTypes,
} from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@insightPlatform/IInsightPlatformRepository.js";
import {
  IDeliverInsightsParams,
  IExecuteMetatransactionParams,
  IReceivePreviewsParams,
} from "@insightPlatform/params/index.js";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getWalletBackups(
    dataWalletKey: EVMPrivateKey,
    fileName: string,
  ): ResultAsync<GetFilesResponse, AjaxError> {
    const baseURL = URLString("http://localhost:3006");
    const signableData = {
      fileName: fileName,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        authorizationBackupTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        console.log("getGoogleCloudStorage - SIGNED CORRECTLY!");
        const url = new URL(urlJoin(baseURL, "/getWalletBackups"));
        /* Following schema from .yaml file: */
        /* https://github.com/SnickerdoodleLabs/protocol/blob/develop/documentation/openapi/Insight%20Platform%20API.yaml */
        return this.ajaxUtils.post<GetFilesResponse>(url, {
          fileName: fileName,
          signature: signature,
        });
      });
  }

  public getGoogleCloudStorage(
    dataWalletKey: EVMPrivateKey,
    fileName: string,
  ): ResultAsync<Bucket, AjaxError> {
    const baseURL = URLString("http://localhost:3006");
    const signableData = {
      fileName: fileName,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        authorizationBackupTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        console.log("getGoogleCloudStorage - SIGNED CORRECTLY!");
        const url = new URL(urlJoin(baseURL, "/getGoogleStorage"));
        /* Following schema from .yaml file: */
        /* https://github.com/SnickerdoodleLabs/protocol/blob/develop/documentation/openapi/Insight%20Platform%20API.yaml */
        return this.ajaxUtils.post<Bucket>(url, {
          fileName: fileName,
          signature: signature,
        });
      });
  }

  public getAuthBackups(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    fileName: string,
  ): ResultAsync<GetSignedUrlResponse[], AjaxError> {
    const signableData = {
      fileName: fileName,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        authorizationBackupTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        // console.log("GET AUTH BACKUPS - SIGNED CORRECTLY!");
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "/getAuthorizedBackups"),
        );
        /* Following schema from .yaml file: */
        /* https://github.com/SnickerdoodleLabs/protocol/blob/develop/documentation/openapi/Insight%20Platform%20API.yaml */
        return this.ajaxUtils.post<GetSignedUrlResponse[]>(url, {
          fileName: fileName,
          signature: signature,
        });
      });
  }

  //
  public receivePreviews(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    answeredQueries: QueryIdentifier[],
  ): ResultAsync<EligibleReward[], AjaxError> {
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
        return this.ajaxUtils.post<EligibleReward[]>(url, {
          consentContractId: consentContractAddress,
          queryCID: queryCID,
          tokenId: tokenId.toString(),
          queries: answeredQueries,
          signature: signature,
        } as IReceivePreviewsParams as unknown as Record<string, unknown>);
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