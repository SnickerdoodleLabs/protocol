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

import { InsightString } from "@core/interfaces/objects/index.js";

export interface IInsightPlatformRepository {
  claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, AjaxError>;

  deliverInsights(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    signature: Signature,
    returns: InsightString[],
  ): ResultAsync<void, AjaxError>;

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
  ): ResultAsync<void, AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
