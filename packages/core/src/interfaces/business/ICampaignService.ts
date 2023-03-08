import {
  EvaluationError,
  EVMContractAddress,
  PossibleReward,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICampaignService {
  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError>;
}

export const ICampaignServiceType = Symbol.for("ICampaignService");
