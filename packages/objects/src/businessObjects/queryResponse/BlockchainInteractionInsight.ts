import { ETimePeriods, EChain } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  AccountAddress,
} from "@objects/primitives/index.js";

export class BlockchainInteractionInsight {
  constructor(
    public chainId: EChain,
    public address: AccountAddress,
    public interacted: boolean,
    public timePeriods?: ETimePeriods,
    public measurementTime?: UnixTimestamp,
  ) {}
}
