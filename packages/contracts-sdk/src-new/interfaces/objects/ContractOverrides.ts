export class ContractOverrides {
  public constructor(
    public maxFeePerGas: bigint | null = null,
    public gasPrice: bigint | null = null,
    public gasLimit: bigint | null = null,
    public value: bigint | null = null,
    public nonce: number | null = null,
  ) {}
}
