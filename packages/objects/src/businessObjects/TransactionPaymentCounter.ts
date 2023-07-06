import { BigNumberString, ChainId } from "@objects/primitives/index.js";
export class TransactionPaymentCounter {
  constructor(
    public chainId: ChainId,
    public incomingValue: number,
    public incomingCount: number,
    public outgoingValue: number,
    public outgoingCount: number,
  ) {}
}
