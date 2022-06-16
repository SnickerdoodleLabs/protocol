import { BigNumber } from "ethers";

export class ContractOverrides {
  public constructor(
    public maxFeePerGas: BigNumber | null = null,
    public gasPrice: BigNumber | null = null,
    public gasLimit: BigNumber | null = null,
    public value: BigNumber | null = null,
    public nonce: number | null = null,
  ) {}
}
