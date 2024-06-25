import { Brand, make } from "ts-brand";

// Farcaster's Add signature
// https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add-signature

export type SignedAddSignature = Brand<string, "SignedAddSignature">;
export const SignedAddSignature = make<SignedAddSignature>();
