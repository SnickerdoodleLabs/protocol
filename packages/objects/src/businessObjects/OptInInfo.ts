import {
  Commitment,
  EVMContractAddress,
  NullifierBNS,
  TrapdoorBNS,
} from "@objects/primitives/index.js";

export class OptInInfo {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public identityNullifier: NullifierBNS,
    public identityTrapdoor: TrapdoorBNS,
    public commitment: Commitment,
  ) {}
}
