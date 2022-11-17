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
  ExpectedReward,
  QueryIdentifier,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  receivePreviews(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCid: IpfsCID,
    signingKey: EVMPrivateKey,
    insightPlatformBaseUrl: URLString,
    answeredQueries: QueryIdentifier[],
  ): ResultAsync<EligibleReward[], AjaxError>;

  deliverInsights(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    queryCid: IpfsCID,
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
