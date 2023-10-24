import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import { AccountAddress } from "@objects/primitives/index.js";

export abstract class WalletNFT {
  public constructor(
    public type: EChainTechnology,
    public chain: EChain,
    public owner: AccountAddress,
    public token: TokenAddress,
    public name: string,
  ) {}
}
