import { EVMAccountAddress } from "@snickerdoodlelabs/objects";

export class AccountContext {
  private onInitialized: () => void;
  constructor(
    onInitialized: () => void,
    protected account: EVMAccountAddress | null = null,
    protected initialized: boolean = false,
  ) {
    this.onInitialized = onInitialized;
  }

  public initialize(account: EVMAccountAddress) {
    this.account = account;
    this.initialized = true;
    this.onInitialized?.();
  }

  public getAccount() {
    return this.account;
  }
}
