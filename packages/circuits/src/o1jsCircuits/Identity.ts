import { Poseidon, Field, Struct } from "o1js";

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
