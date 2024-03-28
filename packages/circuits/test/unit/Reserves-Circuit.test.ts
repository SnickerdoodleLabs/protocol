import {
  ForeignCurve,
  CanonicalForeignField,
  MerkleTree,
  Poseidon,
  Field,
  Encoding,
} from "o1js";

import {
  Secp256k1,
  Ecdsa,
  Reserves,
  Bytes32,
} from "@circuits/o1jsCircuits/Reserves.js";

// helper function build generating a bunch of key pairs
class PublicPrivateKeyMocks {
  static generateKeys(count: number): [ForeignCurve, CanonicalForeignField][] {
    const keypairs = new Array<[ForeignCurve, CanonicalForeignField]>();

    for (let i = 0; i < count; i++) {
      const privateKey = Secp256k1.Scalar.random();
      const publicKey = Secp256k1.generator.scale(privateKey);
      keypairs.push([publicKey, privateKey]);
    }
    return keypairs;
  }
}

// helper function for building the merkle tree of hashed public keys
function packMerkleTree(
  keypairs: Array<[ForeignCurve, CanonicalForeignField]>,
): MerkleTree {
  const keyTree = new MerkleTree(16); // assumes tree w/ 2^16 leaves
  const numKeys = keypairs.length;
  for (let i = 0; i < numKeys; i++) {
    const keyhash = Poseidon.hash(Secp256k1.provable.toFields(keypairs[i][0]));
    keyTree.setLeaf(BigInt(i), keyhash);
  }
  return keyTree;
}

describe("Proof of Reserves with Circuit Class", () => {
  test("Generate Proof of Reserves with Circuit", async () => {
    // create an ensemble of public-private key pairs
    const keys = PublicPrivateKeyMocks.generateKeys(100);

    // use one of the keys to sign an arbitrary message
    const keySlot = 23; // this is the key in the set we are going to use
    const message = Bytes32.fromString("Snickerdoodle");
    const signature = Ecdsa.sign(
      message.toBytes(),
      keys[keySlot][1].toBigInt(),
    );

    // build a merkle tree of the keypair ensemble
    const keyTree = packMerkleTree(keys);

    // calculate the merkleRoot of the key tree
    const merkleRoot: Field = keyTree.getRoot();

    // get the private witness object for keySlot
    const witness = keyTree.getWitness(BigInt(keySlot));

    // construct an arbitrary optional data payload and hash it
    const signal = "Here is my optional data payload.";
    const signalFields = Encoding.stringToFields(signal);
    const signalHash = Poseidon.hash([...signalFields]);
    const signalHashSquared = signalHash.mul(signalHash);

    // compile and prove
    console.time("Reserves verify (compile)");
    const kp = await Reserves.generateKeypair();
    console.timeEnd("Reserves verify (compile)");

    console.time("Reserves verify (prove)");
    const proof = await Reserves.prove(
      [witness, signature, keys[keySlot][0]],
      [merkleRoot, message, signalHash, signalHashSquared],
      kp,
    );
    console.timeEnd("Reserves verify (prove)");
  }, 300000);
});
