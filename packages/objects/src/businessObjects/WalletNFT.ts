import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import { AccountAddress, ChainId } from "@objects/primitives";

export abstract class WalletNFT {
  public constructor(
    public type: EChainTechnology,
    public chain: ChainId,
    public owner: AccountAddress,
    public token: TokenAddress,
  ) {}
}
