import { BigNumberString, ChainId } from "@objects/primitives";

export interface ITransactionPaymentCounter {
  chainId: ChainId;
  incomingValue: BigNumberString;
  incomingCount: BigNumberString;
  outgoingValue: BigNumberString;
  outgoingCount: BigNumberString;
}

export class TransactionPaymentCounter {
  chainId: ChainId;
  incomingValue: BigNumberString;
  incomingCount: BigNumberString;
  outgoingValue: BigNumberString;
  outgoingCount: BigNumberString;

  constructor(
    chain: ChainId,
    incomingValue: BigNumberString,
    incomingCount: BigNumberString,
    outgoingValue: BigNumberString,
    outgoingCount: BigNumberString,
  ) {
    this.chainId = chain;
    this.incomingValue = incomingValue;
    this.incomingCount = incomingCount;
    this.outgoingValue = outgoingValue;
    this.outgoingCount = outgoingCount;
  }
}
