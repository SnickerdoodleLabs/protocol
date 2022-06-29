import {
  EVMAccountAddress,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";

export class EthereumAccount {
  public constructor(
    public accountAddress: EVMAccountAddress,
    public privateKey: EVMPrivateKey,
  ) { }
}
