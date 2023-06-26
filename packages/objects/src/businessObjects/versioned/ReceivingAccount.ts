import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ERecordKey } from "@objects/enum/index.js";
import {
  AccountAddress,
  EVMContractAddress,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class ReceivingAccount extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return this.contractAddress;
  }
  public constructor(
    public contractAddress: EVMContractAddress,
    public receivingAddress: AccountAddress,
  ) {
    super();
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return ReceivingAccount.CURRENT_VERSION;
  }
}

export class ReceivingAccountMigrator extends VersionedObjectMigrator<ReceivingAccount> {
  public getCurrentVersion(): number {
    return ReceivingAccount.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): ReceivingAccount {
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

export class RealmReceivingAccount extends Realm.Object<RealmReceivingAccount> {
  primaryKey!: string;
  contractAddres!: string;
  receivingAddress!: string;

  static schema = {
    name: ERecordKey.RECEIVING_ADDRESSES,
    properties: {
      primaryKey: "string",
      contractAddres: "string",
      receivingAddress: "string",
    },
    primaryKey: "primaryKey",
  };
}
