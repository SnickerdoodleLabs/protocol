export class TransactionMetrics {
  constructor(
    public incomingNativeValue: number,
    public incomingCount: number,
    public outgoingNativeValue: number,
    public outgoingCount: number,
  ) {}
}
