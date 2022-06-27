import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EthereumContractAddress,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BusinessConsentContract } from "@core/interfaces/objects";

export interface IInsightPlatformRepository {
  claimReward(insights: Insight[]): ResultAsync<Map<IpfsCID, Reward>, never>;
  deliverInsights(insights: Insight[]): ResultAsync<void, never>;

  getBusinessConsentContracts(): ResultAsync<
    BusinessConsentContract[],
    AjaxError
  >;

  acceptInvitation(
    invitation: CohortInvitation,
    signature: Signature,
  ): ResultAsync<TokenId, never>;

  leaveCohort(
    consentContractAddress: EthereumContractAddress,
  ): ResultAsync<void, never>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
