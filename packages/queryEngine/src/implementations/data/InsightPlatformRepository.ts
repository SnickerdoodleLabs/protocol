import { Insight, IpfsCID, Reward } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IInsightPlatformRepository } from "@query-engine/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@query-engine/interfaces/utilities";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(IConfigProviderType) public configProvider: IConfigProvider,
  ) {}

  public claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, never> {
    throw new Error("undefined");
  }

  public deliverInsights(insights: Insight[]): ResultAsync<void, never> {
    throw new Error("undefined");
  }
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
