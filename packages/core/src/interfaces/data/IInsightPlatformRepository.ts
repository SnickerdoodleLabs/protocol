import {
  AjaxError,
  Insight,
  IpfsCID,
  Reward,
  CohortInvitation,
  EVMContractAddress,
  Signature,
  TokenId,
  DomainName,
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BusinessConsentContract } from "@core/interfaces/objects";

export interface IInsightPlatformRepository {
  claimReward(
    insights: Insight[],
  ): ResultAsync<Map<IpfsCID, Reward>, AjaxError>;

  deliverInsights(insights: Insight[]): ResultAsync<void, AjaxError>;

  getBusinessConsentContracts(): ResultAsync<
    BusinessConsentContract[],
    AjaxError
  >;

  acceptInvitation(
    dataWalletAddress: DataWalletAddress,
    invitation: CohortInvitation,
    signature: Signature,
  ): ResultAsync<void, AjaxError>;

  leaveCohort(
    dataWalletAddress: DataWalletAddress,
    consentContractAddress: EVMContractAddress,
    signature: Signature,
  ): ResultAsync<void, AjaxError>;

  getTXTRecords(domainName: DomainName): ResultAsync<string[], AjaxError>;
}

export const IInsightPlatformRepositoryType = Symbol.for(
  "IInsightPlatformRepository",
);
