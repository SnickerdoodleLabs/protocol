import { RSAKeyPair } from "@objects/businessObjects/RSAKeyPair.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  DomainName,
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
  UUID,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities";

export class DomainCredential extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public domain: DomainName,
    public id: UUID,
    public key: RSAKeyPair,
  ) {
    super();
  }

  public getVersion(): number {
    return DomainCredential.CURRENT_VERSION;
  }
}

export class DomainCredentialMigrator extends VersionedObjectMigrator<DomainCredential> {
  public getCurrentVersion(): number {
    return DomainCredential.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<DomainCredential>): DomainCredential {
    return new DomainCredential(
      data.domain,
      data.id,
      new RSAKeyPair(data.key.privateKey, data.key.publicKey),
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
