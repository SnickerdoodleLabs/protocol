import { ETimePeriods , EChain} from "@objects/enum/index.js"
import { ISO8601DateString , AccountAddress} from "@objects/primitives/index.js"

export class BlockchainInteractionInsight {
constructor(
    public chainId: EChain,
    public address: AccountAddress,
    public interacted: boolean,
    public timePeriods ?: ETimePeriods,
    public measurementTime ?: ISO8601DateString
) {}
}
