import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ERecordKey } from "@objects/enum";
import {
  IpfsCID,
  AdKey,
  Signature,
  EVMContractAddress,
  JsonWebToken,
  VolatileStorageKey,
} from "@objects/primitives";

export class AdSignature extends VersionedObject {
  public primaryKey: VolatileStorageKey;

  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public adKey: AdKey,
    public signature: Signature | JsonWebToken,
  ) {
    super();
    this.primaryKey = AdSignature.getKey(queryCID, adKey);
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return AdSignature.CURRENT_VERSION;
  }

  public static getKey(queryCID: IpfsCID, adKey: AdKey): VolatileStorageKey {
    return `${queryCID}_${adKey}`;
  }
}

export class AdSignatureMigrator extends VersionedObjectMigrator<AdSignature> {
  public getCurrentVersion(): number {
    return AdSignature.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): AdSignature {
    return new AdSignature(
      data["consentContractAddress"] as EVMContractAddress,
      data["queryCID"] as IpfsCID,
      data["adKey"] as AdKey,
      data["signature"] as Signature | JsonWebToken,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmAdSignature extends Realm.Object<RealmAdSignature> {
  primaryKey!: string;
  consentContractAddress!: string;
  queryCID!: string;
  adKey!: string;
  signature!: string;

  static schema = {
    name: ERecordKey.AD_SIGNATURES,
    properties: {
      primaryKey: "string",
      consentContractAddress: "string",
      queryCID: "string",
      adKey: "string",
      signature: "string",
    },
    primaryKey: "primaryKey",
  };
}
