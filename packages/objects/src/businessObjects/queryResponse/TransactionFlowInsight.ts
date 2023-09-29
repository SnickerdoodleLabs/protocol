import { TransactionMetrics } from "@objects/businessObjects/queryResponse/TransactionMetrics.js";
import { EChain } from "@objects/enum/index.js";
import { ISO8601DateString } from "@objects/primitives/index.js";

export class TransactionFlowInsight {
  constructor(
    public chainId: EChain,
    public day: TransactionMetrics,
    public week: TransactionMetrics,
    public month: TransactionMetrics,
    public year: TransactionMetrics,
    public measurementTime: ISO8601DateString,
  ) {}
}
// public
// day - year - week - month  --- old
// measuremnt time : utc
// query repsponse time :
// EDate
