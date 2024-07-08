import { Brand, make } from "ts-brand";

export type ED25519PublicKey = Brand<string, "ED25519PublicKey">;
export const ED25519PublicKey = make<ED25519PublicKey>();
