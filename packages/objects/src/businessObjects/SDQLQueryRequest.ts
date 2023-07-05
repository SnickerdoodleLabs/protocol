import { EligibleReward } from "@objects/businessObjects/rewards/index.js";
import { SDQLQuery } from "@objects/businessObjects/SDQLQuery.js";
import { LinkedAccount } from "@objects/businessObjects/versioned/index.js";
import {
  DataWalletAddress,
  EVMContractAddress,
} from "@objects/primitives/index.js";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly query: SDQLQuery,
    readonly rewardsPreview: EligibleReward[],
    readonly accounts: LinkedAccount[],
    readonly dataWalletAddress: DataWalletAddress | null,
  ) {}
}
