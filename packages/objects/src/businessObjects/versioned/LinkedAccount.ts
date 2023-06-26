import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObjectMigrator.js";
import { EChain, ERecordKey } from "@objects/enum/index.js";
import {
  AccountAddress,
  EVMAccountAddress,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class LinkedAccountMigrator extends VersionedObjectMigrator<LinkedAccount> {
  public getCurrentVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): LinkedAccount {
    return new LinkedAccount(
      data["sourceChain"] as EChain,
      data["sourceAccountAddress"] as AccountAddress,
      data["derivedAccountAddress"] as EVMAccountAddress,
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
  public primaryKey: VolatileStorageKey;
  public constructor(
    public sourceChain: EChain,
    public sourceAccountAddress: AccountAddress,
    public derivedAccountAddress: EVMAccountAddress,
  ) {
    super();
    this.primaryKey = sourceAccountAddress;
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }
}

export class RealmLinkedAccount extends Realm.Object<LinkedAccount> {
  primaryKey!: string;
  sourceChain!: number;
  sourceAccountAddress!: string;
  derivedAccountAddress!: string;

  static schema = {
    name: ERecordKey.ACCOUNT,
    properties: {
      primaryKey: "string",
      sourceAccountAddress: "string",
      sourceChain: "int",
      derivedAccountAddress: "string",
    },
    primaryKey: "primaryKey",
  };
}
