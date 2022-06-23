import { EthereumAccountAddress } from "@snickerdoodlelabs/objects";

export class AccountContext {
  private onInitialized: () => void;
  constructor(
    onInitialized: () => void,
    public account: EthereumAccountAddress | null = null,
    public initialized: boolean = false,
  ) {
    this.onInitialized = onInitialized;
  }

  public initialize(account: EthereumAccountAddress) {
    this.account = account;
    this.initialized = true;
    this.onInitialized?.();
  }
}
