import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { ERecordKey } from "@objects/enum";
import { VolatileStorageKey } from "@objects/primitives";
import { AccountAddress } from "@objects/primitives/AccountAddress";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress";

export class ReceivingAccount extends VersionedObject {
  public pKey: VolatileStorageKey;
  public constructor(
    public contractAddress: EVMContractAddress,
    public receivingAddress: AccountAddress,
  ) {
    super();
    this.pKey = contractAddress;
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
  pKey!: string;
  contractAddres!: string;
  receivingAddress!: string;

  static schema = {
    name: ERecordKey.RECEIVING_ADDRESSES,
    properties: {
      pKey: "string",
      contractAddres: "string",
      receivingAddress: "string",
    },
    primaryKey: "pKey",
  };
}
