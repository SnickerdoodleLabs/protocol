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

  // Need the any because I have a nested object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected factory(data: Record<string, any>): DomainCredential {
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
