import { EVMAccountAddress } from "@snickerdoodlelabs/objects";

export class UserContext {
  constructor(
    protected accounts: EVMAccountAddress[] = [],
    protected name: string | null = null,
    protected email: string | null = null,
  ) {}

  public getAccounts() {
    return this.accounts;
  }

  public setAccount(accounts: EVMAccountAddress[]) {
    return (this.accounts = accounts);
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    return (this.name = name);
  }

  public getEmail() {
    return this.email;
  }

  public setEmail(email: string) {
    return (this.email = email);
  }
}
