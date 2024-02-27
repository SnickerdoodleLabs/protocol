import {
  Circuit,
  Poseidon,
  Field,
  MerkleWitness,
  Struct,
  circuitMain,
  public_,
} from "o1js";

export class MembershipWitness extends MerkleWitness(16) {}

export class Identity extends Struct({
  identityTrapdoor: Field,
  identityNullifier: Field,
}) {
  secret(): Field {
    return Poseidon.hash([this.identityTrapdoor, this.identityNullifier]);
  }

  leaf(): Field {
    return Poseidon.hash([this.secret()]);
  }
}

export class Membership extends Circuit {
  @circuitMain
  static main(
    @public_ merkleRoot: Field,
    @public_ epochNullifier: Field,
    @public_ signalNullifier: Field,
    @public_ signalHash: Field,
    @public_ signalHashSquared: Field,
    identity: Identity,
    path: MembershipWitness,
  ) {
    // we check that the identity is contained in the anonymity set
    path.calculateRoot(identity.leaf()).assertEquals(merkleRoot);

    // now we check that the signalNullifier was computed properly to prevent duplicate responses
    Poseidon.hash([identity.identityNullifier, epochNullifier]).assertEquals(
      signalNullifier,
    );

    // lastly, check that the communicated signal has not been tampered with
    signalHash.mul(signalHash).assertEquals(signalHashSquared);
  }
}
