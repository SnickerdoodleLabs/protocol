import {
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
} from "@objects/primitives/index.js";

export class RSAKeyPair {
  public constructor(
    public privateKey: PEMEncodedRSAPrivateKey,
    public publicKey: PEMEncodedRSAPublicKey,
  ) {}
}
