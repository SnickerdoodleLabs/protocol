import {
  EVMAccountAddress,
  FarcasterIDGatewayRegisterIdSignature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects/src/primitives/index.js";

// Farcaster's Bundler's Registration param
// https://docs.farcaster.xyz/reference/contracts/reference/bundler#register

export class RegistrationParams {
  public constructor(
    public to: EVMAccountAddress,
    public recovery: EVMAccountAddress,
    public sig: FarcasterIDGatewayRegisterIdSignature,
    public deadline: UnixTimestamp,
  ) {}
}
