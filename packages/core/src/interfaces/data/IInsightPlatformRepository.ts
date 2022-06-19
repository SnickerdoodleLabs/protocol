import { Insight, IpfsCID, Reward } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { BusinessConsentContract } from "@core/interfaces/objects";

export interface IInsightPlatformRepository {
  claimReward(insights: Insight[]): ResultAsync<Map<IpfsCID, Reward>, never>;
  deliverInsights(insights: Insight[]): ResultAsync<void, never>;
  getBusinessConsentContracts(): ResultAsync<BusinessConsentContract[], never>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
