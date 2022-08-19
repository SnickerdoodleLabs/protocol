import { EVMAccountAddress, EVMPrivateKey } from "@objects/primitives";

export class ExternallyOwnedAccount {
  public constructor(
    public accountAddress: EVMAccountAddress,
    public privateKey: EVMPrivateKey,
  ) {}
}
