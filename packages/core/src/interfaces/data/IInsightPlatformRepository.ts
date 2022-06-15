import { Insight, IpfsCID, Reward } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInsightPlatformRepository {
  claimReward(insights: Insight[]): ResultAsync<Map<IpfsCID, Reward>, never>;
  deliverInsights(insights: Insight[]): ResultAsync<void, never>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
