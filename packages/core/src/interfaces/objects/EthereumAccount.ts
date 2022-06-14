import {
  EthereumAccountAddress,
  EthereumPrivateKey,
} from "@snickerdoodlelabs/objects";

export class EthereumAccount {
  public constructor(
    public accountAddress: EthereumAccountAddress,
    public privateKey: EthereumPrivateKey,
  ) {}
}
