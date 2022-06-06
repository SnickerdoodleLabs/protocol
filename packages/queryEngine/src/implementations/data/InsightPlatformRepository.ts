import { IConfigProvider, IConfigProviderType } from "@query-engine/interfaces/utilities";
import { IInsightPlatformRepository } from "@query-engine/interfaces/data";
import { Insight, IpfsCID, Reward } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class InsightPlatformRepository implements IInsightPlatformRepository {
    public construction(@inject(IConfigProviderType) configProvider: IConfigProvider) {}

    public claimReward(insights: Insight[]): ResultAsync<Map<IpfsCID, Reward>, never> {
        throw new Error("undefined");

    }
    
    public deliverInsights(insights: Insight[]): ResultAsync<void, never>  {
        throw new Error("undefined");
    }
}

export const IInsightPlatformRepositoryType = Symbol.for("IInsightPlatformRepository");