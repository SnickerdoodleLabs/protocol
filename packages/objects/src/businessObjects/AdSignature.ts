import {
  IpfsCID,
  AdKey,
  Signature,
  EVMContractAddress,
  JsonWebToken,
} from "@objects/primitives";

export class AdSignature {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public adKey: AdKey,
    public signature: Signature | JsonWebToken,
  ) {}
}
