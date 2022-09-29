export class SolanaSignature {
  public constructor(
    public signature: string,
    public slot: number,
    public err: object | null,
    public memo: string | null,
    public blockTime: number | null,
  ) {}
}

export class SolanaTransaction extends SolanaSignature {
  public constructor(
    public signature: string,
    public slot: number,
    public err: object | null,
    public memo: string | null,
    public blockTime: number | null,
  ) {
    super(signature, slot, err, memo, blockTime);
  }
}
