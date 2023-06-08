import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { EChain, ERecordKey } from "@objects/enum";
import {
  AccountAddress,
  EVMAccountAddress,
  VolatileStorageKey,
} from "@objects/primitives";

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
  public pKey: VolatileStorageKey;
  public constructor(
    public sourceChain: EChain,
    public sourceAccountAddress: AccountAddress,
    public derivedAccountAddress: EVMAccountAddress,
  ) {
    super();
    this.pKey = sourceAccountAddress;
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }
}

export class RealmLinkedAccount extends Realm.Object<LinkedAccount> {
  pKey!: string;
  sourceChain!: number;
  sourceAccountAddress!: string;
  derivedAccountAddress!: string;

  static schema = {
    name: ERecordKey.ACCOUNT,
    properties: {
      pKey: "string",
      sourceAccountAddress: "string",
      sourceChain: "int",
      derivedAccountAddress: "string",
    },
    primaryKey: "pKey",
  };
}
