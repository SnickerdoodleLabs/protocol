import { AdContent } from "@objects/businessObjects/AdContent.js";
import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObjectMigrator.js";
import { ERecordKey } from "@objects/enum/index.js";
import {
  AdKey,
  EVMContractAddress,
  IpfsCID,
  UnixTimestamp,
  EAdDisplayType,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class EligibleAd extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return EligibleAd.getKey(this.queryCID, this.key);
  }

  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public key: AdKey, // 'a1'
    public name: string,
    public content: AdContent,
    public text: string | null,
    public displayType: EAdDisplayType,
    public weight: number,
    public expiry: UnixTimestamp,
    public keywords: string[],
  ) {
    super();
  }

  public getUniqueId(): string {
    return this.queryCID + this.key;
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return EligibleAd.CURRENT_VERSION;
  }

  public static getKey(queryCID: IpfsCID, key: AdKey): VolatileStorageKey {
    return `${queryCID}_${key}`;
  }
}

export class EligibleAdMigrator extends VersionedObjectMigrator<EligibleAd> {
  public getCurrentVersion(): number {
    return EligibleAd.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): EligibleAd {
    return new EligibleAd(
      data["consentContractAddress"] as EVMContractAddress,
      data["queryCID"] as IpfsCID,
      data["key"] as AdKey,
      data["name"] as string,
      data["content"] as AdContent, // looks kinda dangerous
      data["text"] as string,
      data["displayType"] as EAdDisplayType,
      data["weight"] as number,
      data["expiry"] as UnixTimestamp,
      data["keywords"] as string[],
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmEligibleAd extends Realm.Object<RealmEligibleAd> {
  primaryKey!: string;
  consentContractAddress!: string;
  queryCID!: string;
  key!: string;
  name!: string;
  content!: RealmAdContext;
  text!: string | null;
  displayType!: string;
  weight!: number;
  expiry!: number;
  keywords!: Realm.List<string>;

  static schema = {
    name: ERecordKey.ELIGIBLE_ADS,
    properties: {
      primaryKey: "string",
      consentContractAddress: "string",
      queryCID: "string",
      key: "string",
      name: "string",
      content: "{}",
      text: "string?",
      displayType: "string",
      weight: "int",
      expiry: "int",
      keywords: "string[]",
    },
    primaryKey: "primaryKey",
  };
}

export interface RealmAdContext extends Realm.Dictionary {
  type: string;
  src: string;
}
