import { SDQLQuery } from "@objects/businessObjects/SDQLQuery";
import { EVMContractAddress } from "@objects/primitives";
import { EligibleReward } from "./EligibleReward";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly query: SDQLQuery,
    readonly rewardsPreview: EligibleReward[] | null
  ) {}
}
