import { Insight, IpfsCID, Reward } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IInsightPlatformRepository } from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
  public constructor(
    @inject(IConfigProviderType) public configProvider: IConfigProvider,
  ) { }

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
