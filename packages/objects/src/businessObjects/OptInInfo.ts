import {
  BigNumberString,
  Commitment,
  EVMContractAddress,
} from "@objects/primitives/index.js";

export class OptInInfo {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public identityNullifier: BigNumberString,
    public identityTrapdoor: BigNumberString,
    public commitment: Commitment,
  ) {}
}
