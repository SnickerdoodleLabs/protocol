import { Circuit, Poseidon, Field, circuitMain, public_ } from "o1js";

import { Identity } from "@circuits/Identity.js";

export class Commitment extends Circuit {
  @circuitMain
  static main(
    @public_ commitmentHash: Field,
    @public_ signalHash: Field,
    @public_ signalHashSquared: Field,
    identity: Identity,
  ) {
    // now we check that the signalNullifier was computed properly to prevent duplicate responses
    Poseidon.hash([
      identity.identityTrapdoor,
      identity.identityNullifier,
    ]).assertEquals(commitmentHash);

    // lastly, check that the communicated signal has not been tampered with
    signalHash.mul(signalHash).assertEquals(signalHashSquared);
  }
}
