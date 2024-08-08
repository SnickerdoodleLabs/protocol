import {
    ED25519PrivateKey,
    ED25519PublicKey,
  } from "@objects/primitives/index.js";
  
  export class NobleED25519KeyPair {
    public constructor(
      public publicKey: ED25519PublicKey,
      public privateKey: ED25519PrivateKey,
    ) {}
  }
  