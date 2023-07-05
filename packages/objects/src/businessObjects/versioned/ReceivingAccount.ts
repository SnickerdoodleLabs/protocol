import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  AccountAddress,
  EVMContractAddress,
} from "@objects/primitives/index.js";

export class ReceivingAccount extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public contractAddress: EVMContractAddress,
    public receivingAddress: AccountAddress,
  ) {
    super();
  }

  public getVersion(): number {
    return ReceivingAccount.CURRENT_VERSION;
  }
}

export class ReceivingAccountMigrator extends VersionedObjectMigrator<ReceivingAccount> {
  public getCurrentVersion(): number {
    return ReceivingAccount.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): ReceivingAccount {
    return new ReceivingAccount(
      data["contractAddress"] as EVMContractAddress,
      data["receivingAddress"] as AccountAddress,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
