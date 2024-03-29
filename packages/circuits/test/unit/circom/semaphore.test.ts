import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon";
import { LeanIMT } from "@zk-kit/imt";
import { poseidon2 } from "poseidon-lite";
import { groth16 } from "snarkjs";

import semaphoreVerificationKey from "@circuits/circom/semaphore/semaphore.verificationkey.json";
import { semaphoreCode } from "@circuits/circom/semaphore/semaphore.wasm.js";
import { semaphoreZKey } from "@circuits/circom/semaphore/semaphore.zkey.js";

// import { semaphoreVerificationKey } from "@circuits/circom/SemaphoreVerificationKey.js";

const MAX_DEPTH = 16;
const scope = 32;
const message = 43;

class SemaphoreMocks {}

describe("semaphore", () => {
  afterAll(async () => {
    // This is magic. Web workers are left open for the curve object so that it doesn't have to re-initialize.
    // But it messes with testing specifically, so we use this to kill it.
    // https://github.com/iden3/snarkjs/issues/152
    await globalThis.curve_bn128.terminate();
  });

  test("Should calculate the root and the nullifier correctly", async () => {
    // Arrange
    const mocks = new SemaphoreMocks();

    const identityTrapdoor = deriveSecretScalar("foo");
    const identityNullifier = deriveSecretScalar("bar");

    const leaf = poseidon2([identityTrapdoor, identityNullifier]);

    const tree = new LeanIMT((a, b) => poseidon2([a, b]));

    tree.insert(leaf);

    for (let i = 1; i < 4; i += 1) {
      tree.insert(BigInt(i));
    }

    const { siblings: merkleProofSiblings, index } = tree.generateProof(0);

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 20, so the number of siblings must be 20, even if
    // the tree depth is actually 3. The missing siblings can be set to 0, as they
    // won't be used to calculate the root in the circuit.
    const merkleProofIndices: number[] = [];

    for (let i = 0; i < MAX_DEPTH; i += 1) {
      merkleProofIndices.push((index >> i) & 1);

      if (merkleProofSiblings[i] === undefined) {
        merkleProofSiblings[i] = BigInt(0);
      }
    }

    const INPUT = {
      identityTrapdoor: identityTrapdoor,
      identityNullifier: identityNullifier,
      merkleProofLength: tree.depth,
      merkleProofIndices,
      merkleProofSiblings,
      scope,
      message,
    };

    // Act
    console.time("Proving");
    const { proof, publicSignals } = await groth16.fullProve(
      INPUT,
      semaphoreCode,
      semaphoreZKey,
    );
    console.timeEnd("Proving");

    // Assert
    const [merkleRoot, nullifier] = publicSignals;
    expect(merkleRoot).toBe(tree.root.toString());
    expect(nullifier).toBe(poseidon2([scope, identityNullifier]).toString());
  });

  test("Proof Validates", async () => {
    // Arrange
    const mocks = new SemaphoreMocks();

    const identityTrapdoor = deriveSecretScalar("foo");
    const identityNullifier = deriveSecretScalar("bar");

    const leaf = poseidon2([identityTrapdoor, identityNullifier]);

    const tree = new LeanIMT((a, b) => poseidon2([a, b]));

    tree.insert(leaf);

    for (let i = 1; i < 4; i += 1) {
      tree.insert(BigInt(i));
    }

    const { siblings: merkleProofSiblings, index } = tree.generateProof(0);

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 20, so the number of siblings must be 20, even if
    // the tree depth is actually 3. The missing siblings can be set to 0, as they
    // won't be used to calculate the root in the circuit.
    const merkleProofIndices: number[] = [];

    for (let i = 0; i < MAX_DEPTH; i += 1) {
      merkleProofIndices.push((index >> i) & 1);

      if (merkleProofSiblings[i] === undefined) {
        merkleProofSiblings[i] = BigInt(0);
      }
    }

    const INPUT = {
      identityTrapdoor: identityTrapdoor,
      identityNullifier: identityNullifier,
      merkleProofLength: tree.depth,
      merkleProofIndices,
      merkleProofSiblings,
      scope,
      message,
    };

    // Act
    console.time("Proving");
    const { proof, publicSignals } = await groth16.fullProve(
      INPUT,
      semaphoreCode,
      semaphoreZKey,
    );
    console.log("CHARLIE", publicSignals);
    console.timeEnd("Proving");

    console.time("Verifying");
    const verifyResult = await groth16.verify(
      semaphoreVerificationKey,
      publicSignals,
      proof,
    );
    console.timeEnd("Verifying");

    // Assert
    const [merkleRoot, nullifier] = publicSignals;
    expect(verifyResult).toBe(true);
    expect(merkleRoot).toBe(tree.root.toString());
    expect(nullifier).toBe(poseidon2([scope, identityNullifier]).toString());
  });
});
