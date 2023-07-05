import { EVMAccountAddress, EVMPrivateKey } from "@objects/primitives/index.js";

export class ExternallyOwnedAccount {
  public constructor(
    public accountAddress: EVMAccountAddress,
    public privateKey: EVMPrivateKey,
  ) {}
}
