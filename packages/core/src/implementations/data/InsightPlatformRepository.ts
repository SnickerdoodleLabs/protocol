import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IInsightPlatformRepository } from "@core/interfaces/data";
import { BusinessConsentContract } from "@core/interfaces/objects";
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

  public getBusinessConsentContracts(): ResultAsync<
    BusinessConsentContract[],
    AjaxError
  > {
    throw new Error("undefined");
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    signature: Signature,
  ): ResultAsync<TokenId, never> {
    throw new Error("Method not implemented.");
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
