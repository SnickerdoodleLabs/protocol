import { RSAKeyPair } from "@objects/businessObjects/RSAKeyPair.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { ERecordKey } from "@objects/enum";
import {
  DomainName,
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
  UUID,
  VolatileStorageKey,
} from "@objects/primitives";

export class DomainCredential extends VersionedObject {
  public pKey: VolatileStorageKey;

  public constructor(
    public domain: DomainName,
    public id: UUID,
    public key: RSAKeyPair,
  ) {
    super();
    this.pKey = domain;
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return DomainCredential.CURRENT_VERSION;
  }
}

export class DomainCredentialMigrator extends VersionedObjectMigrator<DomainCredential> {
  public getCurrentVersion(): number {
    return DomainCredential.CURRENT_VERSION;
  }

  // Need the any because I have a nested object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public factory(data: Record<string, any>): DomainCredential {
    return new DomainCredential(
      data["domain"] as DomainName,
      data["id"] as UUID,
      new RSAKeyPair(
        data["key"]["privateKey"] as PEMEncodedRSAPrivateKey,
        data["key"]["publicKey"] as PEMEncodedRSAPublicKey,
      ),
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmDomainCredential extends Realm.Object<RealmDomainCredential> {
  pKey!: string;
  id!: string;
  key!: RealmRsaKeyPair;

  static schema = {
    name: ERecordKey.DOMAIN_CREDENTIALS,
    properties: {
      pKey: "string",
      id: "string",
      key: "{}",
    },
    primaryKey: "pKey",
  };
}

export interface RealmRsaKeyPair extends Realm.Dictionary {
  privateKey: string;
  publicKey: string;
}
