import { Brand, make } from "ts-brand";

// Private key with 0x prefix
export type ED25519PrivateKey = Brand<string, "ED25519PrivateKey">;
export const ED25519PrivateKey = make<ED25519PrivateKey>();
