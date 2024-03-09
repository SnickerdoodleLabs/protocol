import {
  ZkProgram,
  Crypto,
  createEcdsa,
  createForeignCurve,
  Bool,
  Bytes,
} from "o1js";

export { keccakAndEcdsa, Secp256k1, Ecdsa, Bytes32 };

class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {}
class Scalar extends Secp256k1.Scalar {}
class Ecdsa extends createEcdsa(Secp256k1) {}
class Bytes32 extends Bytes(32) {}

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
