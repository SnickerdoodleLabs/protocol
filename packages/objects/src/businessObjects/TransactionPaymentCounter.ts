import { EChain } from "@objects/enum/index.js";

export class TransactionPaymentCounter {
  constructor(
    public chainId: EChain,
    public incomingValue: number,
    public incomingCount: number,
    public outgoingValue: number,
    public outgoingCount: number,
  ) {}
}
