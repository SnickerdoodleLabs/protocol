import { Brand, make } from "ts-brand";

// Fascaster's Register signature
// https://docs.farcaster.xyz/reference/contracts/reference/id-gateway#register-signature

export type FarcasterRegisterSignature = Brand<
  string,
  "FarcasterRegisterSignature"
>;
export const FarcasterRegisterSignature = make<FarcasterRegisterSignature>();
