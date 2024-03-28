import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon";
import { LeanIMT } from "@zk-kit/imt";
import { WitnessTester } from "circomkit";
import { poseidon2 } from "poseidon-lite";
import { groth16 } from "snarkjs";

import { circomkit } from "@circuits-test/unit/common.js";

const MAX_DEPTH = 16;
const scope = 32;
const message = 43;

class SemaphoreMocks {
  // public async factory(): Promise<
  //   WitnessTester<
  //     [
  //       "identityTrapdoor",
  //       "identityNullifier",
  //       "merkleProofLength",
  //       "merkleProofIndices",
  //       "merkleProofSiblings",
  //       "message",
  //       "scope",
  //     ],
  //     ["merkleRoot", "nullifier"]
  //   >
  // > {
  //   return circomkit.WitnessTester("semaphore", {
  //     file: "semaphore",
  //     template: "Semaphore",
  //     params: [MAX_DEPTH],
  //   });
  // }
}

describe("semaphore", () => {
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
      "src/circom/semaphore.wasm",
      "src/circom/semaphore.zkey",
    );
    console.timeEnd("Proving");

    // Assert
    const [merkleRoot, nullifier] = publicSignals;
    expect(merkleRoot).toBe(tree.root.toString());
    expect(nullifier).toBe(poseidon2([scope, identityNullifier]).toString());
  });
});
