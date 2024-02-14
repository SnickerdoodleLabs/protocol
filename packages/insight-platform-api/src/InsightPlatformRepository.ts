import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AjaxError,
  BigNumberString,
  EarnedReward,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  IDynamicRewardParameter,
  IpfsCID,
  Signature,
  TokenId,
  URLString,
  IQueryDeliveryItems,
  PossibleReward,
  Questionnaire,
  IQuestionnaireDeliveryItems,
} from "@snickerdoodlelabs/objects";
import {
  clearCloudBackupsTypes,
  executeMetatransactionTypes,
  insightDeliveryTypes,
  insightPreviewTypes,
  signedUrlTypes,
  snickerdoodleSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@insightPlatform/IInsightPlatformRepository.js";
import {
  IClearCloudBackupsParams,
  IDeliverInsightsParams,
  IDeliverQuestionnaireParams,
  IExecuteMetatransactionParams,
  IReceivePreviewsParams,
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
  public receivePreviews(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<PossibleReward[], AjaxError> {
    const signableData = {
      consentContractId: consentContractAddress,
      tokenId: tokenId,
      queryCID: queryCID,
      queryDeliveryItems: JSON.stringify(queryDeliveryItems),
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
        return this.ajaxUtils.post<PossibleReward[]>(url, {
          consentContractId: consentContractAddress,
          queryCID: queryCID,
          tokenId: tokenId.toString(),
          queryDeliveryItems: queryDeliveryItems,
          signature: signature,
        } as IReceivePreviewsParams as unknown as Record<string, unknown>);
      });
  }

  public deliverInsights(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    insights: IQueryDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<EarnedReward[], AjaxError> {
    let parameters = JSON.stringify([]);
    if (rewardParameters !== undefined) {
      parameters = JSON.stringify(rewardParameters);
    }

    const signableData = {
      consentContractId: consentContractAddress,
      tokenId: tokenId,
      queryCID: queryCID,
      insights: JSON.stringify(insights),
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
          insights: insights,
          rewardParameters: rewardParameters,
          signature: signature,
        } as IDeliverInsightsParams as unknown as Record<string, unknown>);
      });
  }

  public deliverQuestionnaires(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    questionnaires: IQuestionnaireDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<Questionnaire[], AjaxError> {
    let parameters = JSON.stringify([]);
    if (rewardParameters !== undefined) {
      parameters = JSON.stringify(rewardParameters);
    }

    const signableData = {
      consentContractId: consentContractAddress,
      tokenId: tokenId,
      queryCID: queryCID,
      questionnaires: JSON.stringify(questionnaires),
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
          urlJoin(insightPlatformBaseUrl, "questionnaires/responses"),
        );
        return this.ajaxUtils.post<Questionnaire[]>(url, {
          consentContractId: consentContractAddress,
          tokenId: tokenId.toString(),
          queryCID: queryCID,
          questionnaires: questionnaires,
          rewardParameters: rewardParameters,
          signature: signature,
        } as IDeliverQuestionnaireParams as unknown as Record<string, unknown>);
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