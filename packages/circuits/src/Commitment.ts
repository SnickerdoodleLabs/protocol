import { Circuit, Field, circuitMain, public_ } from "o1js";

import { Identity } from "@circuits/Identity.js";

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
