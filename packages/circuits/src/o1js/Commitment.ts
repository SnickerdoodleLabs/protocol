import { Circuit, Field, circuitMain, public_, ZkProgram, Struct } from "o1js";

import { Identity } from "@circuits/o1js/Identity.js";

export class Commitment extends Circuit {
  @circuitMain
  static main(
    @public_ commitmentLeaf: Field,
    @public_ signalHash: Field,
    @public_ signalHashSquared: Field,
    identity: Identity,
  ) {
    // now we check that the signalNullifier was computed properly to prevent duplicate responses
    identity.leaf().assertEquals(commitmentLeaf);

    // lastly, check that the communicated signal has not been tampered with
    signalHash.mul(signalHash).assertEquals(signalHashSquared);
  }
}

export class CommitmentVerifyParams extends Struct({
  commitmentLeaf: Field,
  signalHash: Field,
  signalHashSquared: Field,
}) {}

export const commitmentVerification = ZkProgram({
  name: "commitment",
  publicInput: CommitmentVerifyParams,

  methods: {
    commitmentVerify: {
      privateInputs: [Identity],
      method(params: CommitmentVerifyParams, identity: Identity) {
        // now we check that the signalNullifier was computed properly to prevent duplicate responses
        identity.leaf().assertEquals(params.commitmentLeaf);

        // lastly, check that the communicated signal has not been tampered with
        params.signalHash
          .mul(params.signalHash)
          .assertEquals(params.signalHashSquared);
      },
    },
  },
});
