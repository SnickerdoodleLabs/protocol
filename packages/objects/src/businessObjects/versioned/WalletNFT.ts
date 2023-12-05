import { VersionedObject } from "./VersionedObject";

import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  AccountAddress,
  NftTokenAddressWithTokenId,
} from "@objects/primitives/index.js";

export abstract class WalletNFT extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public type: EChainTechnology,
    public chain: EChain,
    public owner: AccountAddress,
    public token: TokenAddress,
    public name: string,
    public id: NftTokenAddressWithTokenId,
  ) {
    super();
  }

  public getVersion(): number {
    return WalletNFT.CURRENT_VERSION;
  }
}
