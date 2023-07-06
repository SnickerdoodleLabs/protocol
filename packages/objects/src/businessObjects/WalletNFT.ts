import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChainTechnology } from "@objects/enum/index.js";
import { AccountAddress, ChainId } from "@objects/primitives/index.js";

export abstract class WalletNFT {
  public constructor(
    public type: EChainTechnology,
    public chain: ChainId,
    public owner: AccountAddress,
    public token: TokenAddress,
    public name: string,
  ) {}
}
