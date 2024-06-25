import {
  EVMAccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects/src/primitives/index.js";

// Combining Farcaster's Signed Key Request signature and encoded metadata

export class RegistrationParams {
  public constructor(
    public to: EVMAccountAddress,
    public recovery: EVMAccountAddress,
    public sig: Signature,
    public deadline: bigint,
  ) {}
}
