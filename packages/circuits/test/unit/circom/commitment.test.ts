import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon";
import {
  poseidon1,
  poseidon2,
  poseidon3,
  poseidon4,
  poseidon5,
  poseidon6,
  poseidon7,
  poseidon8,
  poseidon9,
  poseidon10,
  poseidon11,
  poseidon12,
  poseidon13,
  poseidon14,
  poseidon15,
  poseidon16,
} from "poseidon-lite";
import { groth16 } from "snarkjs";

import commitmentVerificationKey from "@circuits/circom/commitment/commitment.verificationkey.json";
import { commitmentCode } from "@circuits/circom/commitment/commitment.wasm.js";
import { commitmentZKey } from "@circuits/circom/commitment/commitment.zkey.js";

// import { commitmentVerificationKey } from "@circuits/circom/CommitmentVerificationKey.js";

const messageText = "Hello, Phoebe!";

class CommitmentMocks {}

const STOP = 0x01;
function bytesToFields(bytes: Uint8Array): bigint[] {
  // we encode 248 bits (31 bytes) at a time into one field element
  const fields = new Array<bigint>();
  let currentBigInt = 0n;
  let bitPosition = 0n;
  for (const byte of bytes) {
    currentBigInt += BigInt(byte) << bitPosition;
    bitPosition += 8n;
    if (bitPosition === 248n) {
      fields.push(currentBigInt);
      currentBigInt = 0n;
      bitPosition = 0n;
    }
  }
  // encode the final chunk, with an added STOP byte to make the mapping invertible
  currentBigInt += BigInt(STOP) << bitPosition;
  fields.push(currentBigInt);
  return fields;
}

function stringToFields(message: string): bigint[] {
  const bytes = new TextEncoder().encode(message);
  return bytesToFields(bytes);
}

function stringToField(message: string): bigint {
  const fields = stringToFields(message);

  if (fields.length == 1) {
    return poseidon1(fields);
  } else if (fields.length == 2) {
    return poseidon2(fields);
  } else if (fields.length == 3) {
    return poseidon3(fields);
  } else if (fields.length == 4) {
    return poseidon4(fields);
  } else if (fields.length == 5) {
    return poseidon5(fields);
  } else if (fields.length == 6) {
    return poseidon6(fields);
  } else if (fields.length == 7) {
    return poseidon7(fields);
  } else if (fields.length == 8) {
    return poseidon8(fields);
  } else if (fields.length == 9) {
    return poseidon9(fields);
  } else if (fields.length == 10) {
    return poseidon10(fields);
  } else if (fields.length == 11) {
    return poseidon11(fields);
  } else if (fields.length == 12) {
    return poseidon12(fields);
  } else if (fields.length == 13) {
    return poseidon13(fields);
  } else if (fields.length == 14) {
    return poseidon14(fields);
  } else if (fields.length == 15) {
    return poseidon15(fields);
  } else if (fields.length == 16) {
    return poseidon16(fields);
  }

  // If the message is longer than 16 fields, we need to break it up into chunks
  // TODO
  throw new Error("Message too long");
}

describe("commitment", () => {
  afterAll(async () => {
    // This is magic. Web workers are left open for the curve object so that it doesn't have to re-initialize.
    // But it messes with testing specifically, so we use this to kill it.
    // https://github.com/iden3/snarkjs/issues/152
    if (globalThis.curve_bn128 != null) {
      await globalThis.curve_bn128.terminate();
    }
  });

  test("Commitment circuit should generate a proof with a commitment and messageSquare", async () => {
    // Arrange
    const mocks = new CommitmentMocks();

    const message = stringToField(messageText);
    const messageSquare = message * message;
    const identityTrapdoor = deriveSecretScalar("foo");
    const identityNullifier = deriveSecretScalar("bar");
    const commitment = poseidon2([identityTrapdoor, identityNullifier]);

    const INPUT = {
      identityTrapdoor: identityTrapdoor,
      identityNullifier: identityNullifier,
      message,
    };

    // Act
    console.time("Proving");
    const { proof, publicSignals } = await groth16.fullProve(
      INPUT,
      commitmentCode,
      commitmentZKey,
    );
    console.log(proof, publicSignals);
    console.timeEnd("Proving");

    // Assert
    const [commitmentOutput, messageSquareOutput] = publicSignals;
    expect(commitmentOutput).toBe(commitment.toString());
    expect(messageSquareOutput).toBe(messageSquare.toString());
  });

  // test("Proof Validates", async () => {
  //   // Arrange
  //   const mocks = new CommitmentMocks();

  //   const identityTrapdoor = deriveSecretScalar("foo");
  //   const identityNullifier = deriveSecretScalar("bar");

  //   const leaf = poseidon2([identityTrapdoor, identityNullifier]);

  //   const tree = new LeanIMT((a, b) => poseidon2([a, b]));

  //   tree.insert(leaf);

  //   for (let i = 1; i < 4; i += 1) {
  //     tree.insert(BigInt(i));
  //   }

  //   const { siblings: merkleProofSiblings, index } = tree.generateProof(0);

  //   // The index must be converted to a list of indices, 1 for each tree level.
  //   // The circuit tree depth is 20, so the number of siblings must be 20, even if
  //   // the tree depth is actually 3. The missing siblings can be set to 0, as they
  //   // won't be used to calculate the root in the circuit.
  //   const merkleProofIndices: number[] = [];

  //   for (let i = 0; i < MAX_DEPTH; i += 1) {
  //     merkleProofIndices.push((index >> i) & 1);

  //     if (merkleProofSiblings[i] === undefined) {
  //       merkleProofSiblings[i] = BigInt(0);
  //     }
  //   }

  //   const INPUT = {
  //     identityTrapdoor: identityTrapdoor,
  //     identityNullifier: identityNullifier,
  //     merkleProofLength: tree.depth,
  //     merkleProofIndices,
  //     merkleProofSiblings,
  //     scope,
  //     message,
  //   };

  //   // Act
  //   console.time("Proving");
  //   const { proof, publicSignals } = await groth16.fullProve(
  //     INPUT,
  //     commitmentCode,
  //     commitmentZKey,
  //   );
  //   console.timeEnd("Proving");

  //   console.time("Verifying");
  //   const verifyResult = await groth16.verify(
  //     commitmentVerificationKey,
  //     publicSignals,
  //     proof,
  //   );
  //   console.timeEnd("Verifying");

  //   // Assert
  //   const [merkleRoot, nullifier] = publicSignals;
  //   expect(verifyResult).toBe(true);
  //   expect(merkleRoot).toBe(tree.root.toString());
  //   expect(nullifier).toBe(poseidon2([scope, identityNullifier]).toString());
  // });
});
