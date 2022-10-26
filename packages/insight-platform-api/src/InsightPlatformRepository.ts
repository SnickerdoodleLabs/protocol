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
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
  insightDeliveryTypes,
} from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInsightPlatformRepository } from "@insightPlatform/IInsightPlatformRepository.js";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public isValidSignatureForInvitation(
    consentAddress: EVMContractAddress,
    tokenId: BigNumberString,
    signature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<boolean, AjaxError> {
    const url = new URL(
      urlJoin(insightPlatformBaseUrl, "chain/validate-invitation-signature"),
    );
    const params: {
      consentAddress: EVMContractAddress;
      tokenId: BigNumberString;
      signature: Signature;
    } = {
      consentAddress,
      tokenId,
      signature,
    };

    return this.ajaxUtils.get<boolean>(url, { params });
  }

  public deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryCid: IpfsCID,
    returns: InsightString[],
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError> {
    const returnsString = JSON.stringify(returns);
    const signableData = {
      consentContractId: consentContractAddress,
      queryCid: queryCid,
      dataWallet: dataWalletAddress,
      returns: returnsString,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        insightDeliveryTypes,
        signableData,
        dataWalletKey,
      )
      .andThen((signature) => {
        const url = new URL(
          urlJoin(insightPlatformBaseUrl, "insights/responses"),
        );

        return this.ajaxUtils.post<boolean>(url, {
          consentContractId: consentContractAddress,
          queryCid: queryCid,
          dataWallet: dataWalletAddress,
          returns: returns,
          signature: signature,
        });
      })
      .map((response) => {
        console.log("Ajax response: " + JSON.stringify(response));
        // return okAsync({});
      });
  }

  public executeMetatransaction(
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    value: BigNumberString,
    gas: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError> {
    const signingData = {
      dataWallet: dataWalletAddress,
      accountAddress: accountAddress,
      contractAddress: contractAddress,
      nonce: nonce,
      data: data,
      metatransactionSignature: metatransactionSignature,
    } as Record<string, unknown>;

    return this.cryptoUtils
      .signTypedData(
        snickerdoodleSigningDomain,
        executeMetatransactionTypes,
        signingData,
        dataWalletKey,
      )
      .andThen((signature) => {
        const url = new URL(urlJoin(insightPlatformBaseUrl, "metatransaction"));

        const postBody = {
          dataWalletAddress: dataWalletAddress,
          accountAddress: accountAddress,
          contractAddress: contractAddress,
          nonce: nonce,
          value: value,
          gas: gas,
          data: data,
          metatransactionSignature: metatransactionSignature,
          requestSignature: signature,
        };

        return this.ajaxUtils.post<IExecuteMetatransactionResponse>(
          url,
          postBody,
        );
      })
      .map(() => {});
  }
}

// Refer to documentation/openapi/Insight Platform API.yaml
interface IExecuteMetatransactionResponse {
  success: boolean;
}
