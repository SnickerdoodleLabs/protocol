import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  EVMContractAddress,
  Signature,
  DataWalletAddress,
  HexString,
  EVMAccountAddress,
  EVMPrivateKey,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, AjaxError>;

  deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    signature: Signature,
    insights: Insight[],
  ): ResultAsync<void, AjaxError>;

  executeMetatransaction(
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    contractAddress: EVMContractAddress,
    nonce: BigNumberString,
    data: HexString,
    metatransactionSignature: Signature,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
