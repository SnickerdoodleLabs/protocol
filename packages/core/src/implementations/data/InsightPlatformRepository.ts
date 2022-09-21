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
  EVMContractAddress,
  Signature,
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

import { IInsightPlatformRepository } from "@core/interfaces/data/index.js";
import { InsightString } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

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
    returns: InsightString[],
  ): ResultAsync<void, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = new URL(
          urlJoin(config.defaultInsightPlatformBaseUrl, "insights/responses"),
        );
        return this.ajaxUtils.post<boolean>(url, {
          consentContractId: consentContractAddress,
          queryCid: queryId,
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
  ): ResultAsync<void, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
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
            config.snickerdoodleProtocolDomain,
            executeMetatransactionTypes,
            signingData,
            dataWalletKey,
          )
          .andThen((signature) => {
            const url = new URL(
              urlJoin(config.defaultInsightPlatformBaseUrl, "metatransaction"),
            );

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
          });
      })
      .map(() => {});
  }
}

// Refer to documentation/openapi/Insight Platform API.yaml
interface IExecuteMetatransactionResponse {
  success: boolean;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
