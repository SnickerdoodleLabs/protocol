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
  NullifierBNS,
  PublicEvents,
  TrapdoorBNS,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  deliverInsights(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    queryCID: IpfsCID,
    insights: IQueryDeliveryItems,
    rewardParameters: IDynamicRewardParameter[],
    anonymitySet: Commitment[],
    anonymitySetStart: number,
    insightPlatformBaseUrl: URLString,
    publicEvents: PublicEvents,
  ): ResultAsync<EarnedReward[], AjaxError | CircuitError>;

  optin(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError>;

  privateOptin(
    consentContractAddress: EVMContractAddress,
    trapdoor: TrapdoorBNS,
    nullifier: NullifierBNS,
    nonce: BigNumberString,
    signature: Signature,
    insightPlatformBaseUrl: URLString,
  ): ResultAsync<void, AjaxError | CircuitError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
