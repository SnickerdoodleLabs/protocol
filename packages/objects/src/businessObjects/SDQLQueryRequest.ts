import { SDQLQuery } from "@objects/businessObjects/SDQLQuery";
import { EVMContractAddress } from "@objects/primitives";

export class SDQLQueryRequest {
  constructor(
    readonly consentContractAddress: EVMContractAddress,
    readonly query: SDQLQuery,
  ) {}
}
