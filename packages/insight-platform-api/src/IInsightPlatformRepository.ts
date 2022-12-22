import {
  GetSignedUrlConfig,
  Storage,
  Bucket,
  GetSignedUrlResponse,
  File,
  GetFilesCallback,
} from "@google-cloud/storage";
import {
  AjaxError,
  BigNumberString,
  DataWalletAddress,
  EligibleReward,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  InsightString,
  IpfsCID,
  Signature,
  TokenId,
  URLString,
  EarnedReward,
  QueryIdentifier,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  clearAllBackups(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    walletAddress: EVMAccountAddress,
  ): ResultAsync<void, AjaxError>;
  getSignedUrl(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    fileName: string,
  ): ResultAsync<URLString, AjaxError>;

  receivePreviews(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    answeredQueries: QueryIdentifier[],
  ): ResultAsync<EligibleReward[], AjaxError>;

  deliverInsights(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCID: IpfsCID,
    returns: InsightString[],
    rewardParameters: IDynamicRewardParameter[],
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<EarnedReward[], AjaxError>;

  executeMetatransaction(
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    value: BigNumberString,
    gas: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
