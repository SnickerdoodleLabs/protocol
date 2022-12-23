import { BigNumberString, ChainId } from "@objects/primitives";
export class TransactionPaymentCounter {
  constructor(
    public chainId: ChainId,
    public incomingValue: number,
    public incomingCount: number,
    public outgoingValue: number,
    public outgoingCount: number,
  ) {}
}
