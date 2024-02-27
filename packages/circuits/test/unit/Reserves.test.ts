import {
  Secp256k1,
  Ecdsa,
  keccakAndEcdsa,
  Bytes32,
} from "@circuits/reserves.js";

describe("Proof of Reserves", () => {
  test("Generate Proof of Reserves", async () => {
    // create an example ecdsa signature

    const privateKey = Secp256k1.Scalar.random();
    const publicKey = Secp256k1.generator.scale(privateKey);
    const message = Bytes32.fromString("what's up");
    const signature = Ecdsa.sign(message.toBytes(), privateKey.toBigInt());

    // compile and prove
    console.time("keccak + ecdsa verify (compile)");
    await keccakAndEcdsa.compile();
    console.timeEnd("keccak + ecdsa verify (compile)");

    console.time("keccak + ecdsa verify (prove)");
    const proof = await keccakAndEcdsa.verifyEcdsa(
      message,
      signature,
      publicKey,
    );
    console.timeEnd("keccak + ecdsa verify (prove)");

    proof.publicOutput.assertTrue("signature verifies");
    const verifies = await keccakAndEcdsa.verify(proof);
    expect(verifies).toBeTruthy();
  }, 300000);
});
