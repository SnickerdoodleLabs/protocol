import {
  ZkProgram,
  Crypto,
  createEcdsa,
  createForeignCurve,
  Bool,
  Bytes,
  Poseidon,
  Circuit,
  Field,
  circuitMain,
  public_,
} from "o1js";

import { MembershipWitness } from "./Membership";

export { keccakAndEcdsa, Reserves, Secp256k1, Ecdsa, Bytes32 };

class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {}
class Ecdsa extends createEcdsa(Secp256k1) {}
class Bytes32 extends Bytes(32) {}

class Reserves extends Circuit {
  @circuitMain
  static main(
    @public_ merkleRoot: Field,
    @public_ message: Bytes32,
    @public_ signalHash: Field,
    @public_ signalHashSquared: Field,
    path: MembershipWitness,
    signature: Ecdsa,
    publicKey: Secp256k1,
  ) {
    // we check that the public key is contained in the anonymity set of addresses
    path
      .calculateRoot(
        Poseidon.hash([publicKey.x.toFields(), publicKey.y.toFields()]),
      )
      .assertEquals(merkleRoot);

    // then we check that the user owns the public key
    signature.verify(message, publicKey).assertEquals(true);

    // lastly, check that the optional data payload has not been tampered with
    signalHash.mul(signalHash).assertEquals(signalHashSquared);
  }
}

const keccakAndEcdsa = ZkProgram({
  name: "ecdsa",
  publicInput: Bytes32.provable,
  publicOutput: Bool,

  methods: {
    verifyEcdsa: {
      privateInputs: [Ecdsa.provable, Secp256k1.provable],
      method(message: Bytes32, signature: Ecdsa, publicKey: Secp256k1) {
        return signature.verify(message, publicKey);
      },
    },
  },
});
