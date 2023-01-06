import { LinkedAccount } from "@objects/businessObjects";
import { SDQLQuery } from "@objects/businessObjects/SDQLQuery";
import { CompensationKey, DataWalletAddress, EVMContractAddress } from "@objects/primitives";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly query: SDQLQuery,
    readonly eligibleCompIds: CompensationKey[],
    readonly accounts: LinkedAccount[],
    readonly dataWalletAddress: DataWalletAddress | null,
  ) {}
}
