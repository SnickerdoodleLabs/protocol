import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { EChain } from "@objects/enum";
import { AccountAddress, EVMAccountAddress } from "@objects/primitives";

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
    return new Map([
      // [
      //   1,
      //   (data, version) => {
      //     data["foo"] = 0;
      //     return data;
      //   },
      // ],
    ]);
  }
}

export class LinkedAccount extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public sourceChain: EChain,
    public sourceAccountAddress: AccountAddress,
    public derivedAccountAddress: EVMAccountAddress,
  ) {
    super();
  }

  public getVersion(): number {
    return LinkedAccount.CURRENT_VERSION;
  }
}

// export class LinkedAccountV1 extends VersionedObject {
//   public constructor(
//     public sourceChain: EChain,
//     public sourceAccountAddress: AccountAddress,
//     public derivedAccountAddress: EVMAccountAddress,
//   ) {
//     super();
//   }

//   public getVersion(): number {
//     return 1;
//   }
// }

export class RealmLinkedAccount extends Realm.Object<LinkedAccount> {
  sourceChain!: number;
  sourceAccountAddress!: string;
  derivedAccountAddress!: string;

  static schema = {
    name: "LinkedAccount",
    properties: {
      sourceAccountAddress: "string",
      sourceChain: "int",
      derivedAccountAddress: "string",
    },
    primaryKey: "sourceAccountAddress",
  };
}
