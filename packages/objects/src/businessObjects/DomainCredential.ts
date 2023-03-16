import { RSAKeyPair } from "@objects/businessObjects/RSAKeyPair.js";
import { DomainName, UUID } from "@objects/primitives";

export class DomainCredential {
  public constructor(
    public domain: DomainName,
    public id: UUID,
    public key: RSAKeyPair,
  ) {}
}
