import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon";
import { poseidon2 } from "poseidon-lite";
import { groth16 } from "snarkjs";

import { CircomUtils } from "@circuits/CircomUtils.js";
import commitmentVerificationKey from "@circuits/commitment/commitment.verificationkey.json";
import { commitmentCode } from "@circuits/commitment/commitment.wasm.js";
import { commitmentZKey } from "@circuits/commitment/commitment.zkey.js";
import { ICircomCommitmentInputs } from "@circuits/commitment/ICircomCommitmentInputs.js";

// import { commitmentVerificationKey } from "@circuits/CommitmentVerificationKey.js";
const messageText = "Hello, Phoebe!";

class CommitmentMocks {}

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

    const message = CircomUtils.stringToPoseidonHash(messageText);
    const messageSquare = CircomUtils.moduloMultiply(message, message);
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

  test("Commitment circuit validates the generated proof", async () => {
    // Arrange
    const mocks = new CommitmentMocks();

    const message = CircomUtils.stringToPoseidonHash(messageText);
    const identityTrapdoor = deriveSecretScalar("foo");
    const identityNullifier = deriveSecretScalar("bar");

    const INPUT = {
      identityTrapdoor: identityTrapdoor,
      identityNullifier: identityNullifier,
      message,
    } as ICircomCommitmentInputs;

    // Act
    console.time("Proving");
    const { proof, publicSignals } = await groth16.fullProve(
      INPUT,
      commitmentCode,
      commitmentZKey,
    );
    console.log(proof, publicSignals);
    console.timeEnd("Proving");

    console.time("Verifying");
    const verifyResult = await groth16.verify(
      commitmentVerificationKey,
      publicSignals,
      proof,
    );
    console.timeEnd("Verifying");

    // Assert
    expect(verifyResult).toBe(true);
  });
});
