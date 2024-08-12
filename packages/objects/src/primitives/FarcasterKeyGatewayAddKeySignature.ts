import { Brand, make } from "ts-brand";

// Farcaster's Add signature
// https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add-signature

export type FarcasterKeyGatewayAddKeySignature = Brand<
  string,
  "FarcasterKeyGatewayAddKeySignature"
>;
export const FarcasterKeyGatewayAddKeySignature =
  make<FarcasterKeyGatewayAddKeySignature>();
