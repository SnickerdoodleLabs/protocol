import { EChain } from "@objects/enum";
import { AccountAddress, EVMAccountAddress } from "@objects/primitives";

export class LinkedAccount {
  public constructor(
    public sourceChain: EChain,
    public sourceAccountAddress: AccountAddress,
    public derivedAccountAddress: EVMAccountAddress,
  ) {}
}
