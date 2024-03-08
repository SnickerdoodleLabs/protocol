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
  URLString,
  IQueryDeliveryItems,
  Commitment,
  InvalidArgumentError,
  CircuitError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  deliverInsights(
    consentContractAddress: EVMContractAddress,
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    queryCID: IpfsCID,
    insights: IQueryDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    anonymitySet: Commitment[],
    anonymitySetStart: number,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<EarnedReward[], AjaxError | CircuitError>;

  optin(
    consentContractAddress: EVMContractAddress,
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError>;

  privateOptin(
    consentContractAddress: EVMContractAddress,
    trapdoor: BigNumberString,
    nullifier: BigNumberString,
    nonce: BigNumberString,
    signature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
