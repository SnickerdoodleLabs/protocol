import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/UnixTimestamp.js";

export class NftHolding {
  public constructor(
    public chain: keyof typeof EChain | "not registered",
    public tokenAddress: TokenAddress,
    public amount: number,
    public name: string,
    public measurementTime: UnixTimestamp,
  ) {}
}
