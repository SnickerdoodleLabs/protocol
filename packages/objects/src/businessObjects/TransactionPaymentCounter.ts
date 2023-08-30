import { EChain } from "@objects/enum/index.js";

export class TransactionPaymentCounter {
  constructor(
    public chain: EChain,
    public incomingValue: number,
    public incomingCount: number,
    public outgoingValue: number,
    public outgoingCount: number,
  ) {}
}
