import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  AccountAddress,
  BigNumberString,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export abstract class WalletNFT {
  public constructor(
    public type: EChainTechnology,
    public chain: EChain,
    public owner: AccountAddress,
    public token: TokenAddress,
    public name: string,
    public amount: BigNumberString,
    public measurementDate: UnixTimestamp,
  ) {}
}
