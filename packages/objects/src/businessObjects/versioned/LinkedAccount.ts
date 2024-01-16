import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EChain } from "@objects/enum/index.js";
import { AccountAddress } from "@objects/primitives/index.js";

export class LinkedAccountMigrator extends VersionedObjectMigrator<LinkedAccount> {
  public getCurrentVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): LinkedAccount {
    return new LinkedAccount(
      data["sourceChain"] as EChain,
      data["sourceAccountAddress"] as AccountAddress,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class LinkedAccount extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public sourceChain: EChain,
    public sourceAccountAddress: AccountAddress,
  ) {
    super();
  }

  public getVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }
}
