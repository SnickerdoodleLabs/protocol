import { DataWalletAddress } from "@snickerdoodlelabs/objects";

export class AccountContext {
  private onInitialized: (dataWalletAddress: DataWalletAddress) => void;
  constructor(
    onInitialized: (dataWalletAddress: DataWalletAddress) => void,
    protected account: DataWalletAddress | null = null,
    protected initialized: boolean = false,
  ) {
    this.onInitialized = onInitialized;
  }

  public initialize(account: DataWalletAddress) {
    this.account = account;
    this.initialized = true;
    this.onInitialized?.(account);
  }

  public getAccount() {
    return this.account;
  }
}
