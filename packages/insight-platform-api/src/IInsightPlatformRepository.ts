import { GetSignedUrlResponse } from "@google-cloud/storage";
import { PersistenceError } from "@snickerdoodlelabs/objects";
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
  URLString,
  EarnedReward,
  ExpectedReward,
  QueryIdentifier,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  getAuthBackups(
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    key: string,
  ): ResultAsync<GetSignedUrlResponse[], AjaxError>;

  receivePreviews(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryCid: IpfsCID,
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    answeredQueries: QueryIdentifier[],
    expectedRewards: ExpectedReward[],
  ): ResultAsync<EligibleReward[], AjaxError>;

  deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryCid: IpfsCID,
    returns: InsightString[],
    dataWalletKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    rewardParameters?: IDynamicRewardParameter[],
  ): ResultAsync<EarnedReward[], AjaxError>;

  executeMetatransaction(
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
  ): ResultAsync<void, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
