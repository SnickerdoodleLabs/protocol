import { LinkedAccount } from "@objects/businessObjects";
import { SDQLQuery } from "@objects/businessObjects/SDQLQuery";
import { CompensationId, DataWalletAddress, EVMContractAddress } from "@objects/primitives";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly query: SDQLQuery,
    readonly eligibleCompIds: CompensationId[],
    readonly accounts: LinkedAccount[],
    readonly dataWalletAddress: DataWalletAddress | null,
  ) {}
}
